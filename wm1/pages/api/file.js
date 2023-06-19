import formidable from "formidable"
import fs from "fs"
import { openDb } from '../../utils/data'
import { join } from "path"
import path from 'path'
import { withSession, getAdminUser } from "../../utils/session"

export const config = {
    api: {
        externalResolver: true,
        bodyParser: false
    }
}

const post = withSession(async (req, res) => {
    const user = await getAdminUser(req, res) // for session and CORS
    const form = new formidable.IncomingForm()
    form.parse(req, async function (err, fields, file) {
        let ext = path.extname(file.file.originalFilename)
        ext = ext.replace('.', '')
        const result = await saveFile(file.file, req.query.id, req.query.tp, ext)
        if (result.error)
            console.log(result.error)
        else
            console.log(`the file is saved`)
    })
    res.status(200).json({ message: 'ok' })
})

const saveFile = async (file, id, tp, ext) => {
    var stats = fs.statSync(file.filepath)
    if (stats.size < 10000000) {

        const data = fs.readFileSync(file.filepath)
        const tps = tp ?? 'event'
        const ex = ext ?? 'png'
        const fname = join(
            process.env.ROOT_DIR || process.cwd(),
            `/public/images/${tps}/${file.newFilename}.${ex}`
        )
        //const fname = `${process.env.STATIC_FILES}/images/${tps}/${file.newFilename}.${ex}`

        const relname = `/${tps}/${file.newFilename}.${ex}`
        fs.writeFileSync(fname, data)
        await fs.unlinkSync(file.filepath)
        try {
            if (id) {
                const db = await openDb()
                if (tp === 'event') {
                    await db.run(`INSERT INTO ExFile(Name,Event,Archive) VALUES ('${relname}',${id},0)`)
                }
                else {
                    await db.run(`UPDATE Worker SET Image = '${relname}' WHERE Id = ${id}`)
                }
            }
            return { 'fname': fname }
        } catch (error) {
            return { 'error': error }
        }
    } else {
        return { 'error': "the file size can't exceed 2Mb" }
    }

}

export default (req, res) => {
    req.method === "POST"
        ? post(req, res)
        : req.method === "PUT"
            ? console.log("PUT")
            : req.method === "DELETE"
                ? console.log("DELETE")
                : req.method === "GET"
                    ? console.log("GET")
                    : res.status(404).send("")
} 
