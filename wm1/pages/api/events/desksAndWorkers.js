import { desksAndWorkers } from "../../../utils/data"
//import { validUser } from '../../../utils/common'
import { withSession,getUser,redirectToEmpty } from "../../../utils/session"

export default withSession(async (req, res) => {
    //const user = validUser(req, res)
    const user = await getUser(req, res)   
    if (user && user.Id) {
        const result = await desksAndWorkers(user)
        if (result.error)
            res.status(405).json({ "error": error.message, "sql": "deskAndWorkers" })
        else
            res.status(200).json(result)
    } else {
        redirectToEmpty(res) 
    }
})