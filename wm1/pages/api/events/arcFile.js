import { arcFile } from "../../../utils/data"
import { withSession, getAdminUser } from "../../../utils/session"

//export default async (req, res) => {
export default withSession(async (req, res) => {
        const user = await getAdminUser(req, res) // for session and CORS
        const result = await arcFile(req.query.id, req.query.arc) 
        if (result.error)
                res.status(405).json(result)
        else
                res.status(200).json(result)
})