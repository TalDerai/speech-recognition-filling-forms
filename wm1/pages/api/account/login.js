import {withSession,getUserExt} from "../../../utils/session"
import {checkUser} from '../../../utils/data'

export default withSession(async (req, res) => {
    let mail, password, user
  /*   if(req.query.alex && req.query.mail && req.query.password){
        mail  = req.query.mail
        password  = req.query.password
        user = await getUserExt(mail,password)    
    }else  */
    if(req.body.mail && req.body.password){
        mail  = req.body.mail
        password  = req.body.password
        user = await checkUser(mail,password)        
    }           
    if (user && user.data) {        
        req.session.set("user", user.data)
        req.session.set("desks", user.desks)
        await req.session.save()
        res.json({title: 'login', user:user.data,desks:user.desks})
    } else {
        res.json({ title:'login',error: ' TUSHITUSHITUSHI ' }) 
    } 
})