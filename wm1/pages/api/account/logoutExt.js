import {withSession} from "../../../utils/session"

export default withSession(async (req, res) => {   
        req.session.destroy()
        res.json({'title': 'logout','message':'session is destroyed'})    
}) 