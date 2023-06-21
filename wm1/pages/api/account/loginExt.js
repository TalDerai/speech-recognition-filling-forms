import { withSession, getUserExt } from "../../../utils/session"
import { checkUser } from '../../../utils/data'

export default withSession(async (req, res) => {
    let user
    if (req.query.alex && req.query.mail && req.query.password) {
        const mail = req.query.mail
        const password = req.query.password
        user = await checkUser(mail, password)
    }
    if (user && user.data) {        
        req.session.set("user", user.data)
        req.session.set("desks", user.desks)
        await req.session.save()
        res.json({user:user.data,desks:user.desks})
    } else {
        res.json({ 'error': 'משתמש אינו קיים' }) 
    }    
})