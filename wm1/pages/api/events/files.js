import { files } from "../../../utils/data"
import { withSession, getUser,redirectToEmpty } from "../../../utils/session"

export default withSession(async (req, res) => {
        const user = await getUser(req, res)
        if (user && user.Id) {
                const result = await files(req.query.id)
                if (result.error)
                        res.status(405).json(result)
                else
                        res.status(200).json(result)
        } else {
                redirectToEmpty(res)
        }
})
