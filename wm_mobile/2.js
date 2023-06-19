import { template } from './utils/template.js'
import fetch from 'cross-fetch'
import DataIndex from './utils/dataIndex.js'


const ar1 = ['להציג כל הקופות', 'להציק כל הקופות', 'להציק כל הקפות', 'להציג כל הקפות', 'להציק כל אירועים סגורים', '2 להציק כל אירועים סגורים', 'להציק כל האירועים הצגה 5']
const ar2 = ['קופה מספר', 'קפה לפי מספר', 'קפה לפי שם', 'קפה לפי השם', 'עןבד מספר', 'עובדת בשם דובי רכטר','קופה בשם קופת פנורמה','עובד עלפי שם אליק קסלמן']

const test = async ()=>{
    const sttUrl = 'http://localhost:3009/api/dataForStt'
    const resp = await fetch(sttUrl)
    const entities = await resp.json()
    const index = new DataIndex(template,entities)
    const ar = [...ar1,...ar2]
    ar.forEach(a=>{
        console.log(index.findBest(a))    
    })
}

test()
