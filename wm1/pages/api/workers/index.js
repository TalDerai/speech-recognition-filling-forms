import {getList} from '../../../utils/requestUtils'
import { withSession, getUser,redirectToEmpty } from "../../../utils/session"

export default withSession(async (req, res) => { 
        const user = await getUser(req,res)
        if (user && user.Id && user.Permission===3) {
                await getList(user,req, res, 'Worker')
        } else {
                redirectToEmpty(res)
        }        
})