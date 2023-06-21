import {exeUpdate} from '../../../utils/requestUtils'
import { withSession, getUser,redirectToEmpty } from "../../../utils/session"

export default withSession(async (req, res) => { 
        const user = await getUser(req, res)               
        if (user && user.Id) {
                await exeUpdate(req,res,'Event')   
        } else {
               redirectToEmpty(res)
        }          
})