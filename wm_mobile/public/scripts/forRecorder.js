
let isClosedWithoutSend = false
let isRecordModeStarted = false
$(function () {
    var myRecorder = {
        objects: {
            context: null,
            stream: null,
            recorder: null
        },
        init: function () {
            if (null === myRecorder.objects.context) {
                myRecorder.objects.context = new (
                    window.AudioContext || window.webkitAudioContext
                )
            }
        },
        start: function () {
            var options = { audio: true, video: false }
            navigator.mediaDevices.getUserMedia(options).then(function (stream) {
                //detectSilence(stream, myRecorder.stop(stopCallback), myRecorder.start)
                myRecorder.objects.stream = stream
                myRecorder.objects.recorder = new Recorder(
                    myRecorder.objects.context.createMediaStreamSource(stream),
                    { numChannels: 1 }
                )
                myRecorder.objects.recorder.record()
            }).catch(function (err) { })
        },
        stop: function (callback) {
            if (null !== myRecorder.objects.stream) {
                myRecorder.objects.stream.getAudioTracks()[0].stop()
            }
            if (null !== myRecorder.objects.recorder) {
                myRecorder.objects.recorder.stop()
                myRecorder.objects.recorder.exportWAV(function (blob) {
                    ///////////////////////////////////////////////////
                    const myFile = new File([blob], new Date().toUTCString() + '.wav', {
                        type: blob.type,
                    })
                    sendSoundFile(myFile, callback)
                    ///////////////////////////////////////////////////                       
                })
            }
        },
        /*  onstatechange: function(){
             alert(1)
             console.log(myRecorder.state)
          } */
    }

    $('.div-rec').hide()
    $('.div-proc').hide()    
    $('a.sound-rec').on('mousedown touchstart', (e) => {
        e.preventDefault()
        myRecorder.init()
        $('a.sound-rec i').addClass('text-danger') //.removeClass('text-primary')
        $('.div-rec').show()
        myRecorder.start()
    })

    $('a.sound-rec').on('mouseup touchend', () => {
        $('.div-rec').hide()
        $('.div-proc').show() 
        $('a.sound-rec i').removeClass('text-danger') //addClass('text-primary').
        myRecorder.stop(stopCallback)
    })

    $('.progress-div').hide()
    $('.transcript-div').show()

    // Prepare the record button
    $('[data-role="controls"] > button > span').click(function () {
        // Initialize the recorder
        myRecorder.init()

        // Get the button state 
        var buttonState = !!$(this).attr('data-recording')

        // Toggle
        if (!buttonState) {
            $(this).attr('data-recording', 'true')
            $(this).text('הפסק להקליט')
            $(this).parent().addClass('btn-danger').removeClass('btn-primary')
            myRecorder.start()
        } else {
            $(this).attr('data-recording', '')
            $(this).text('התחל להקליט')
            $(this).parent().addClass('btn-primary').removeClass('btn-danger')
            myRecorder.stop(stopCallback)
        }
    })
    /////////////////////////////////////////////////
    const but = $('#btnTest1')
    $('#btnTest1').on('mousedown touchstart', () => {
        myRecorder.init()
        console.log('start')
        $(but).find('span').text('הפסק')
        $(but).addClass('btn-danger').removeClass('btn-primary')
        myRecorder.start()
    })

    $('#btnTest1').on('mouseup touchend', () => {
        $('.transcript-div').hide()
        $('.progress-div').show()        
        console.log('end')
        $(but).find('span').text('התחל')
        $(but).addClass('btn-primary').removeClass('btn-danger')
        myRecorder.stop(stopCallback)
    }) 

    ///////////////////////////////////////////////
    $('[data-menu="menu-sound"]').on('click', () => {
        isClosedWithoutSend = false
        const buttonState = !!$('[data-role="controls"] > button > span').attr('data-recording')
        $('#btnTest').click()
    })

    //close-menu
    $('a.close-menu').on('click', () => {
        isClosedWithoutSend = true
        const buttonState = !!$('[data-role="controls"] > button > span').attr('data-recording')
        if (buttonState) {
            $('#btnTest').click()
        }
    })

    $('#taTranscript').keypress(function (e) {
        if (e.which == 13) {
            if ($("#taTranscript").val().trim() != '') recognize()
            return false
        }
    })
})

const sendSoundFile = async (file, callback) => {

    if (isClosedWithoutSend) return
    const url = '/stt'
    console.log(file)
    const body = new FormData()
    body.append("file", file)
    const resp = await fetch(url, {
        method: 'POST',
        body
    })
    if (resp.status === 400) {
        alert('The site is not supported in voice assistant!');
      }
    else{
        const result = await resp.json()
        callback(result)
    }
}

const fillVoiceResults = (o) => {
    $("#transcript").text(o.src)
    $("#normalized").text(o.act[0].key)
    $("#action").text(o.act[0].path)
}

const clearVoiceResults = () => {
    $("#transcript").text('')
    $("#normalized").text('')
    $("#action").text('')
    $('#json').html('')
}

const runExeTest = async (action = $("#taAction").text()) => {
    if (action && action !== 'na') {
        if (action.indexOf('/reports/') > -1) {
            const url = `https://kupaktana.com${action}`
            window.open(url, '_blank')
        } else {
            $('#myFrame').attr('src', action)
        }
    }
}

const fillTestVoiceResults = (o, fromVoice) => {
    $('.progress-div').hide()
    $('.transcript-div').show()

    if (fromVoice) $("#taTranscript").val(o.src)
    $("#taNormalized").text(o.act[0].key)
    let s = o.act.map(a => {
        return `<div class="card mb-3"><div class="card-body py-0 ">                   
                    <p class="card-text mb-0">${a.key}</p>
                    <div class="ltr">sim: <b>${a.sim.toFixed(2)}</b></div>
                    <div class="ltr">action: <a href="#" class="card-link" onclick="runExeTest('${a.path}')">${a.path}</a></div>
                </div></div>`
    }).join('')
    s = `<b>תוצאות זיהוי</b>${s}<div class="text-center">
                <button class="btn btn-danger" onclick="clearTestVoiceResults()">לנקות</button>                            
            </div>`
    $('#voiceRecResults').html(s)
}

const clearTestVoiceResults = () => {
    $("#taTranscript").val('')
    $('#voiceRecResults').html('')
}

const recognize = async () => {
    const text = $("#taTranscript").val()
    const url = `/sttFromTranscript?text=${text}`
    const resp = await fetch(url)
    const a = await resp.json()
    fillTestVoiceResults(a, false)
}

///////////////////////////////////////
const stopCallback = (a) => {
    $('.div-proc').hide() 
    if (a.src.trim() === '') return
    if (isTest) {
        clearTestVoiceResults()
        fillTestVoiceResults(a, true)
    } else {        
        if (a.path != 'na') {
            fillVoiceResults(a)
            if (a.act[0].path.indexOf('/reports/') > -1) {
                const url1 = `https://kupaktana.com${a.act[0].path}`
                window.open(url1, '_blank')
            } else {
                const url = (a.act[0].path.indexOf('http') > -1 ? '' : document.location.origin) + a.act[0].path
                document.location.assign(url)
            }
        } else {
            $("#result").text('השאילתה לא ברורה, אנא נסה שוב ועיין בדפי העזרה')
        }
    }
}

const detectSilence = ( // not in use
    stream,
    onSoundEnd = _ => { },
    onSoundStart = _ => { },
    silence_delay = 500, //500,
    min_decibels = -80  // -80
) => {
    //const maxRecordTime = 20000
    //const startDetect = (new Date()).getTime()

    const ctx = new AudioContext()
    const analyser = ctx.createAnalyser()
    const streamNode = ctx.createMediaStreamSource(stream)
    streamNode.connect(analyser)
    analyser.minDecibels = min_decibels

    const data = new Uint8Array(analyser.frequencyBinCount) // will hold our data
    let silence_start = performance.now()
    let triggered = false // trigger only once per silence event

    function loop(time) {
        requestAnimationFrame(loop) // we'll loop every 60th of a second to check
        analyser.getByteFrequencyData(data) // get current data
        if (data.some(v => v)) { // if there is data above the given db limit
            if (triggered) {
                triggered = false
                onSoundStart()
            }
            silence_start = time // set it to now
        }

        if (!triggered && time - silence_start > silence_delay) {
            onSoundEnd()
            triggered = true
            ///////////////////////

            setTimeout(() => {
                const o = $('[data-role="controls"] > button > span')
                var buttonState = !!$(o).eq(0).attr('data-recording')
                if (buttonState) {
                    $(o).attr('data-recording', '')
                    $(o).text('התחל להקליט')
                    $(o).parent().addClass('btn-primary').removeClass('btn-danger')
                    $('.transcript-div').hide()
                    $('.progress-div').show()
                }
            }, 500)
        } else if (!triggered) {
            console.log(1, time)
            console.log(2, time - silence_start)
            console.log(3, silence_delay)
        }
    }
    loop()
}