import * as dotenv from 'dotenv'
dotenv.config()
//import urlExists from 'url-exists-deep'
import {
    admin, eTypes, bLinks, eventSummary, eventIcon, workerCategory, fullName,
    API_PATH, FILE_PATH, MOBILE_PATH, dic, createFinderIndex,
    newDesk, newWorker, newEvent, renderFileList
} from './utils/common.js'
import moment from 'moment'
import fetch from 'cross-fetch'
import bodyParser from 'body-parser'
import express from 'express'
import session from 'express-session'
import minifyHTML from 'express-minify-html-2'
//import { fileToStt } from './utils/filetToStt.js'
import formidable from "formidable"
import { fileURLToPath } from 'url'
import { dirname } from 'path'

import { myForm } from './utils/formGenerator.js'

const app = express()

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

app.set('view engine', 'ejs')
app.set('views', './views')
const port = 7000 

app.use(bodyParser.json())        // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
    extended: true
}))

app.use(minifyHTML({
    override: true,
    exception_url: false,
    htmlMinifier: {
        removeComments: true,
        collapseWhitespace: true,
        collapseBooleanAttributes: true,
        removeAttributeQuotes: true,
        removeEmptyAttributes: true,
        minifyJS: true
    }
}))

app.use('/', express.static(__dirname + '/public'))

app.use(session({
    key: 'user_sid',
    secret: 'somerandonstuffs',
    resave: false,
    saveUninitialized: false,
    cookie: {
        expires: 600000
    }
}))

// login page
app.get('/login', async (req, res) => {
    try {
        res.render('login',
            {
                page: 'login',
                error: ''
            })
    } catch (e) {
        console.log(e.message)
        res.render('error', { page: 'login', title: 'login', error: e.message })
    }
})

// login operation
app.post('/login', async (req, res) => {
    //debugger;
    const { mail, password } = req.body
    const loginUrl = `${API_PATH}account/loginExt?${admin.key}=${admin.id}&mail=${mail}&password=${password}`
    const respU = await fetch(loginUrl)
    const o = await respU.json()
    if (o && o.user) {

        const statUrl = `${API_PATH}account/userStat?${admin.key}=${admin.id}&id=${o.user.Id}&prm=${o.user.Permission}`
        const respSt = await fetch(statUrl)
        const stat = await respSt.json()
        req.session.data = {
            page: 'index',
            user: { ...o.user, 'Stat': stat, 'Image': `${FILE_PATH}${o.user.Image.substring(1)}` },
            desks: o.desks,
            selectedDesk: 0,
            selectedWorker: 0,
            selectedType: 'opened',
            types: eTypes,
            bLinks: bLinks
        }
        res.redirect('/')
    } else {
        res.render('login', { page: 'login', error: 'זיהוי משתמש נכשל' })
    }
})

// home page
app.get('/', (req, res) => {
    if (!req.session.data)
        res.render('login', { page: 'login', error: '' })
    else
        res.render('index', { ...req.session.data, page: 'index', title: 'ברוכים הבאים!', newEventParams: '' })
})

// reports
app.get('/reports', async (req, res) => {
    if (!req.session.data)
        res.render('login', { ...req.session.data, page: 'login', error: '' })
    else {
        const dataUrls = `${API_PATH}desks?${admin.key}=${admin.id}&limit=100`
        const respD = await fetch(dataUrls)
        const desks = (await respD.json()).items
        const periods = {
            to: moment().valueOf(),
            month: moment().startOf('month').valueOf(),
            quarter: moment().startOf('quarter').valueOf(),
            year: moment().startOf('year').valueOf(),
            all: moment().add(-10, 'Y').valueOf()
        }
        res.render('reports', {
            ...req.session.data,
            page: 'reports',
            title: 'מחולל דוחות',
            newEventParams: '',
            desks,
            periods,
            selectedDesk: desks[0].Id
        })
    }
})

// manual
app.get('/manual', (req, res) => {
    if (!req.session.data)
        res.render('login', { ...req.session.data, page: 'login', error: '' })
    else
        res.render('manual', { ...req.session.data, page: 'manual', title: 'מדריך למשתמש', newEventParams: '' })
})


// pages
app.get('/events', async (req, res) => {
    if (!req.session.data)
        res.render('login', { page: 'login', error: '' })
    else {
        try {
            if (req.query.desk) req.session.data.selectedDesk = parseInt(req.query.desk)
            if (req.query.worker) req.session.data.selectedWorker = parseInt(req.query.worker)
            if (req.query.type) req.session.data.selectedType = req.query.type
            //console.log(req.query.worker, typeof(req.query.worker))
            const { selectedDesk, selectedWorker, selectedType } = req.session.data
            const dataUrls = `${API_PATH}dataForStt?${admin.key}=${admin.id}` //dataForFilters
            const respD = await fetch(dataUrls)
            const dw = await respD.json()
            let desks = dw.desks
            desks.unshift({ "Id": 0, "Name": "כל הקופות" })

            let workers = dw.workers
            workers.unshift({ "Id": 0, "Name1": "כל העובדים" })
            const worker = workers.find(d => d.Id == selectedWorker)

            const sd = selectedDesk === 0 ? '' : `&desk=${selectedDesk}`
            const sw = selectedWorker === 0 ? '' : `&worker=${selectedWorker}`
            const uEvents = `${API_PATH}events?${admin.key}=${admin.id}&type=${selectedType}${sd}${sw}&limit=100`
            const respE = await fetch(uEvents)
            const events = (await respE.json()).items

            await res.render('events',
                {
                    ...req.session.data,
                    page: 'events',
                    title: 'אירועים',
                    id: 0,
                    newEventParams: '',
                    desks,
                    workers,
                    events,
                    eventIcon,
                    eventSummary
                })
        } catch (e) {
            console.log(e.message)
            res.render('error', { page: 'events', title: 'אירועים', error: e.message })
        }
    }

})

app.get('/eventCard', async (req, res) => {
    if (!req.session.data)
        res.render('login', { page: 'login', error: '' })
    else {

        try {
            // desk and workers
            const dwUrl = `${API_PATH}events/desksAndWorkers?${admin.key}=${admin.id}&id=${req.query.id}`
            const respW = await fetch(dwUrl)
            const dataW = await respW.json()
            const desks = dataW.desks.map(d => { return { 'v': d.Id, 'n': d.Name } })
            const workers = dataW.workers.map(d => { return { 'v': d.Id, 'n': d.Name } })
            const fUrl = `${API_PATH}events/files?${admin.key}=${admin.id}&id=${req.query.id}`
            const respF = await fetch(fUrl)
            const files = await respF.json()
            const id = parseInt(req.query.id)
            const fileList = renderFileList(files, id)
            // card data
            let data
            if (id === 0 && req.query.isDep) {
                data = { ...newEvent(req, desks, workers) }
            } else {
                const dataUrl = `${API_PATH}events/card?${admin.key}=${admin.id}&id=${id}`
                const respD = await fetch(dataUrl)
                data = await respD.json()
            }
            data = { ...data, desks, workers, files }
            const form = new myForm('event', data)

            //console.log(data)

            res.render('eventCard',
                {
                    ...req.session.data,
                    page: 'eventCard',
                    title: id === 0 ? 'אירוע חדש' : `אירוע ${id}`,
                    id: id,
                    newEventParams: `&worker=${data.WorkerId}&desk=${data.DeskId}`,
                    fileList: fileList,
                    form: [form.render(0), form.render(1)],
                    isDep: data.Amount > 0,
                    message: !req.query.msg ? '' : (req.query.msg == '1' ? { tp: 'success', txt: 'הפעולה בוצעה בהצלחה' } : { tp: 'danger', txt: 'שגיאה' })
                })
        } catch (e) {
            console.log(e.message)
            res.render('error', { page: 'eventCard', title: `אירוע ${req.query.id}`, error: e.message })
        }
    }
})

app.get('/eventFiles', async (req, res) => {
    if (!req.session.data)
        res.render('login', { page: 'login', error: '' })
    else {
        try {
            const fUrl = `${API_PATH}events/files?${admin.key}=${admin.id}&id=${req.query.id}`
            const respF = await fetch(fUrl)
            const files = await respF.json()
            const fileList = renderFileList(files, parseInt(req.query.id))
            res.json({ files: fileList })
        } catch (e) {
            console.log(e.message)
            res.json({ page: 'eventFiles', title: `אירוע ${req.query.id}`, error: e.message })
        }
    }
})

app.post('/eventCard', async (req, res) => {
    if (!req.session.data)
        res.render('login', { page: 'login', error: '' })
    else {

        try {
            const action = parseInt(req.body.Id) === 0 ? 'create' : 'update'

            const dataUrl = `${API_PATH}events/${action}?${admin.key}=${admin.id}`
            const body = JSON.stringify({
                ...req.body,
                Amount: (req.body.EventType === 'הפקדה' ? 1 : -1) * req.body.Amount,
                Date: moment(req.body.Date, 'YYYY-MM-DD').format('DD/MM/YYYY'),
                CloseDate: moment(req.body.CloseDate, 'YYYY-MM-DD').format('DD/MM/YYYY')
            })
            const respD = await fetch(dataUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body
            })
            const result = await respD.json()
            if (result.error) {
                console.log(result.error)
                res.redirect(`/eventCard?id=${req.body.Id}&msg=0`)
            } else {
                const id = parseInt(req.body.Id) === 0 ? result.lastID : req.body.Id
                res.redirect(`/eventCard?id=${id}&msg=1`)
            }
        } catch (e) {
            console.log(e.message)
            res.render('error', { page: 'eventCard', title: `אירוע ${req.query.id}`, error: e.message })
        }
    }
})

app.get('/desks', async (req, res) => {
    if (!req.session.data)
        res.render('login', { page: 'login', error: '' })
    else {
        try {
            const dataUrls = `${API_PATH}desks?${admin.key}=${admin.id}&limit=100`
            const respD = await fetch(dataUrls)
            const desks = (await respD.json()).items
            res.render('desks',
                {
                    ...req.session.data,
                    page: 'desks',
                    title: 'קופות',
                    id: 0,
                    newEventParams: '',
                    desks: desks
                })
        } catch (e) {
            console.log(e.message)
            res.render('error', { page: 'desks', title: 'קופות', error: e.message })
        }
    }
})

app.get('/deskCard', async (req, res) => {
    if (!req.session.data)
        res.render('login', { page: 'login', error: '' })
    else {

        try {
            let data
            if (parseInt(req.query.id) === 0) {
                data = { ...newDesk }
            } else {
                const dataUrl = `${API_PATH}desks/card?${admin.key}=${admin.id}&id=${req.query.id}`
                const respD = await fetch(dataUrl)
                data = await respD.json()
            }
            const form = new myForm('desk', data)
            const id = parseInt(req.query.id)
            res.render('deskCard',
                {
                    ...req.session.data,
                    page: 'deskCard',
                    id: id,
                    title: `קופה ${id === 0 ? 'חדשה' : id}`,
                    newEventParams: `&desk=${id}`,
                    form: form.render(),
                    message: !req.query.msg ? '' : (req.query.msg == '1' ? { tp: 'success', txt: 'הפעולה בוצעה בהצלחה' } : { tp: 'danger', txt: 'שגיאה' })
                })
        } catch (e) {
            console.log(e.message)
            res.render('error', { page: 'deskCard', title: `קופה ${req.query.id}`, error: e.message })
        }
    }
})

app.post('/deskCard', async (req, res) => {
    if (!req.session.data)
        res.render('login', { page: 'login', error: '' })
    else {
        try {
            const action = parseInt(req.body.Id) === 0 ? 'create' : 'update'

            const dataUrl = `${API_PATH}desks/${action}?${admin.key}=${admin.id}`
            const body = JSON.stringify({ ...req.body, StartDate: moment(req.body.StartDate, 'YYYY-MM-DD').format('DD/MM/YYYY') })
            const respD = await fetch(dataUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body
            })
            const result = await respD.json()
            if (result.error) {
                console.log(result.error)
                res.redirect(`/deskCard?id=${req.body.Id}&msg=0`)
            } else {
                const id = parseInt(req.body.Id) === 0 ? result.lastID : req.body.Id
                res.redirect(`/deskCard?id=${id}&msg=1`)
            }
        } catch (e) {
            console.log(e.message)
            res.render('error', { page: 'deskCard', title: `קופה ${req.query.id}`, error: e.message })
        }
    }
})

app.get('/workerCard', async (req, res) => {
    if (!req.session.data)
        res.render('login', { page: 'login', error: '' })
    else {

        try {
            let data
            if (parseInt(req.query.id) === 0) {
                data = { ...newWorker }
            } else {
                const dataUrl = `${API_PATH}workers/card?${admin.key}=${admin.id}&id=${req.query.id}`
                const respD = await fetch(dataUrl)
                data = await respD.json()
            }
            //console.log(data)
            const form = new myForm('worker', data)
            const id = parseInt(req.query.id)
            res.render('deskCard',
                {
                    ...req.session.data,
                    page: 'workerCard',
                    title: id === 0 ? 'עובד חדש' : `עובד ${req.query.id}`,
                    id: id,
                    newEventParams: `&worker=${id}`,
                    form: form.render(),
                    message: !req.query.msg ? '' : (req.query.msg == '1' ? { tp: 'success', txt: 'הפעולה בוצעה בהצלחה' } : { tp: 'danger', txt: 'שגיאה' })
                })
        } catch (e) {
            console.log(e.message)
            res.render('error', { page: 'workerCard', title: `עובד ${req.query.id}`, error: e.message })
        }
    }
})

app.post('/workerCard', async (req, res) => {
    if (!req.session.data)
        res.render('login', { page: 'login', error: '' })
    else {
        try {
            const action = parseInt(req.body.Id) === 0 ? 'create' : 'update'

            const dataUrl = `${API_PATH}workers/${action}?${admin.key}=${admin.id}`
            const body = JSON.stringify({ ...req.body })
            const respD = await fetch(dataUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body
            })
            const result = await respD.json()
            if (result.error) {
                console.log(result.error)
                res.redirect(`/workerCard?id=${req.body.Id}&msg=0`)
            } else {
                const id = parseInt(req.body.Id) === 0 ? result.lastID : req.body.Id
                res.redirect(`/workerCard?id=${id}&msg=1`)
            }
        } catch (e) {
            console.log(e.message)
            res.render('error', { page: 'workerCard', title: `עובד ${req.query.id}`, error: e.message })
        }
    }
})

app.get('/workers', async (req, res) => {
    if (!req.session.data)
        res.render('login', { page: 'login', error: '' })
    else {
        try {
            const uWorkers = `${API_PATH}workers?${admin.key}=${admin.id}&limit=200`
            const respW = await fetch(uWorkers)
            const workers = (await respW.json()).items
            res.render('workers',
                {
                    ...req.session.data,
                    page: 'workers',
                    title: 'עובדים',
                    id: 0,
                    newEventParams: '',
                    workers,
                    workerCategory,
                    fullName
                })
        } catch (e) {
            console.log(e.message)
            res.render('error', { page: 'workers', title: 'עובדים', error: e.message })
        }
    }
})

// search
//const url = `/api/desks?limit=${initState.size}&skip=${skip}&arc=${state.arc}&sort=${state.sort}&dir=${state.dir}&key=${state.key}`
app.get('/search', async (req, res) => {
    if (!req.session.data)
        res.render('login', { page: 'login', error: '' })
    else {
        try {
            const type = req.query.type ?? 'events'
            const key = req.query.key
            const url = `${API_PATH}${type}?${admin.key}=${admin.id}&limit=200&key=${key}`
            const resp = await fetch(url)
            const data = await resp.json()
            const st = 'חיפוש'
            let pageData = {
                ...req.session.data,
                page: 'search',
                title: `${st} - ${dic[type]}`,
                id: 0,
                newEventParams: '',
                type,
                key,
                amount: data.items.length,
                workerCategory,
                fullName,
                eventIcon,
                eventSummary
            }
            pageData[type] = data.items
            res.render('search', pageData)
        } catch (e) {
            console.log(e.message)
            res.render('error', { page: 'search', title: 'תוצאות חיפוש', error: e.message })
        }
    }
})


app.get('/logout', async (req, res) => {
    req.session.destroy(() => {
        res.redirect('/login')
    })
})

app.get('/proxy_get/*', async (req, res) => {
    const base = API_PATH.slice(0, -1)
    const url = req.originalUrl.replace('/proxy_get', base)
    const resp = await fetch(url)
    const result = (await resp.json())
    res.json(result)
})

// voice commands
app.get('/test', (req, res) => {   
    res.render('voiceTest', { page: 'voiceTest', error: '' })
})

app.get('/voice', async (req, res) => {
    res.render('voice', {
        page: 'voice',
        error: ''
    })
})

let finder = null
app.post('/stt', async (req, res) => {
    if (!finder) {
        finder = await createFinderIndex()
    }
    const form = new formidable.IncomingForm()
    form.parse(req, async function (err, fields, file) {
    const api_key = "6f8a21986f1a19e543300e4f1a030757d746a07b378268a7d053179bb563ebf4"
    const data = {
        file_path: file.file.filepath, //wav file
        api_key: api_key 
    }
    const response = await fetch('http://localhost:3001/stt', {
        method: 'POST',
        body: JSON.stringify(data)
    })

    const transcript = await response.json()
    if (transcript == "not ok"){
        console.log("transcript is empty")
        //res.json({ src: "", act: "" })
        res.status(400).send("The site is not supported in voice assistant!");
    }
    else{
    console.log(transcript)
    const actions = finder.find(transcript)
    console.log(actions)
    res.json({ src: transcript, act: actions })
    }
    })
})

// app.get('/sttFromTranscript', async (req, res) => {
//     if (!finder) {
//         finder = await createFinderIndex()
//     }
//     const transcript = req.query.text
//     const actions = finder.find(transcript)
//     res.json( {src: transcript, act: actions })
// })


////////////////////////////////// stt ///////////////////////////////////
app.get('/voice1', async (req, res) => {

    res.render('voice1', {
        page: 'voice1',
        error: ''
    })
})

// =========================== SOCKET.IO ================================ //
import http from  'http'
const server = http.createServer(app)
import { Server } from "socket.io"
const io = new Server(server)

// // Google Cloud
// import speech from '@google-cloud/speech'
// const speechClient = new speech.SpeechClient() // Creates a client

// io.on('connection', function (client) {
//     console.log('Client Connected to server')
//     let recognizeStream = null
  
//     client.on('join', function () {
//       client.emit('messages', 'Socket Connected to Server')
//     })
  
//     client.on('messages', function (data) {
//       client.emit('broad', data)
//     })
  
//     client.on('startGoogleCloudStream', function (data) {
//       startRecognitionStream(this, data)
//     })
  
//     client.on('endGoogleCloudStream', function () {
//       stopRecognitionStream()
//     })
  
//     client.on('binaryData', function (data) {
//       // console.log(data) //log binary data
//       if (recognizeStream !== null) {
//         recognizeStream.write(data)
//       }
//     })
  
//     let finder = null
//     const startRecognitionStream = async (client) => {
//       recognizeStream = speechClient
//         .streamingRecognize(request)
//         .on('error', console.error)
//         .on('data', async (data) => {
//           if (data.results[0] && data.results[0].alternatives[0]) {
//             console.log(`Trans: ${data.results[0].alternatives[0].transcript}`)
//           }
          
//           // if end of utterance, let's restart stream
//           // this is a small hack. After 65 seconds of silence, the stream will still throw an error for speech length limit
//           if (data.results[0] && data.results[0].isFinal) {
//             stopRecognitionStream()
//             startRecognitionStream(client)
//             //////////////////////////////////////////////
//             if (!finder) {
//               finder = await createFinderIndex(process.env.API_PATH)
//             }
//             const actions = finder.find(data.results[0].alternatives[0].transcript)
//             //client.emit('completedData',data)
//             let data1 = {...data,final: true,actions}
//             data1.results[0].alternatives[0].transcript
//             client.emit('speechData', data1)
//             //////////////////////////////////////////////
//             console.log('end of expression')
//             // console.log('restarted stream serverside')
//           } else {
//             client.emit('speechData', data)
//           }
//         })
//     }
  
//     function stopRecognitionStream() {
//       if (recognizeStream) {
//         recognizeStream.end()
//       }
//       recognizeStream = null
//     }
//   })
  
//   // =========================== GOOGLE CLOUD SETTINGS ================================ //
  
//   // The encoding of the audio file, e.g. 'LINEAR16'
//   // The sample rate of the audio file in hertz, e.g. 16000
//   // The BCP-47 language code to use, e.g. 'en-US'
//   const encoding = 'LINEAR16'
//   const sampleRateHertz = 16000
//   const languageCode = 'he' //'en-US' //en-US
  
//   const request = {
//     config: {
//       encoding: encoding,
//       sampleRateHertz: sampleRateHertz,
//       languageCode: languageCode,
//       profanityFilter: false,
//       enableWordTimeOffsets: true      
//     },
//     interimResults: true, // If you want interim results, set this to true
//     singleUtterance: true
//   }
// //////////////////////////////////////////////////////////////////////////
  

/* app.listen(port, () => {
    console.log('Server started on: ' + port)
}) */

server.listen(port, () => {
    console.log('Server started on: ' + port)
})