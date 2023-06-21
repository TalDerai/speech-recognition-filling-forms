import {sttData} from '../../utils/data'
import NextCors from 'nextjs-cors'

export default async (req, res) => {

    await NextCors(req, res, {
        // Options
        methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
        origin: '*',
        optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
     })
     
    let data = await sttData()
    res.json(data)
}