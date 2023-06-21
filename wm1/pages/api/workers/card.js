import { getCard } from '../../../utils/requestUtils'
import { withSession, getUser,redirectToEmpty } from "../../../utils/session"


export default withSession(async (req, res) => {
        const user = await getUser(req, res)
        if (user && user.Id) {
                await getCard(req, res, 'Worker')
        } else {
                redirectToEmpty(res)
        }
})