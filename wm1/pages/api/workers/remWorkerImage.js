//*********************** NOT IN USE ********************** */

import { openDb } from "../../../utils/data"
//import fs from "fs"
import * as url from 'url'

export default async (req,res)=>{
        const db = await openDb()        
       
        if(req.query.id){
            const records = await db.all(`SELECT Image FROM Worker WHERE Id = ${req.query.id}`)
            const imFile = records[0].Image.replace('./','').replace(/\//g,'\\')
            console.log(__dirname.replace('.next\\server\\pages\\api\\workers','')+imFile)
            res.send('ok')
            return

            const __filename = url.fileURLToPath('../../../'+imFile)
            console.log(__filename)
            //console.log(`${__dirname}\\${imFile}`)
            //await db.run(`UPDATE Worker SET Image = NULL WHERE Id = ${id}`)
        }

        res.json({'message':`worker ${req.query.id} image is removed`})
}