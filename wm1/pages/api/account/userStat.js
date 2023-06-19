import { userStatistics, checkUserA } from "../../../utils/data"
import { withSession, redirectToEmpty } from "../../../utils/session"

export default withSession(async (req, res) => {
        //const user = await checkUserExt(req)    
        const user = await checkUserA(req.query.id)
        if (!user) return redirectToEmpty(res)

        const id = req.query.id
        const pr = req.query.prm ? parseInt(req.query.prm) : 1
        if (id) {
                const result = await userStatistics(pr,id)
                if (result)
                        res.status(200).json({...result})
                else
                        res.status(405).json({ 'error': `event with id=${id} is missing` })
        } else {
                res.status(405).json({ 'error': 'id is missing' })
        }

})