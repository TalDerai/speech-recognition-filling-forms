import { report } from '../../utils/data'
import { deskFlow, deskSummary } from '../../utils/reportUtils'

export default async (req, res) => {
    const { type, from, to, desk } = req.query
    const d = await report(req.query) //TBD - rem event data

    const id = parseInt(desk)
    const f = parseInt(from)
    const t = parseInt(to)
    const tp = parseInt(type)
    const cnt = req.query.count && req.query.count === '1'
    if (id === 0 && tp === 0)
        res.json({ 'counter': 0 })
    else {       
        if (tp === 0) { 
            const dd = await deskFlow(id, f, t)
            if (cnt)
                res.json({ counter: dd.length })
            else
                res.json({ ...d, data: dd })
        } else {
            deskSummary(d, f, t)
                .then((results) => {          
                    if (cnt)
                        res.json({ counter: results.length })
                    else
                        res.json({ ...d, data: results })
                })
                .catch((e) => {
                    console.log(e)
                    res.json({ ...d, data: [], error: e })
                })
        }
    }
}