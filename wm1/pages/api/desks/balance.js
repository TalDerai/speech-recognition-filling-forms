import { deskBalance, checkUserExt } from "../../../utils/data"
import { withSession, allowCors, redirectToEmpty } from "../../../utils/session"
import NextCors from 'nextjs-cors'

export default withSession(async (req, res) => {
        //await allowCors(req,res)        
        const user = await checkUserExt(req)
        /* let user
        if(req.session.get('user')){
                user = req.session.get("user")
        }else if(req.query.mail && req.query.password){
                const mail  = req.query.mail
                const password  = req.query.password
                user = await checkUser(mail,password)    
        } */

        //console.log(33, user)
        if (!user) return redirectToEmpty(res)

        const id = req.query.id
        if (id) {
                const result = await deskBalance(id)
                if (result.Balance)
                        res.status(200).json({...result, u: user.Id})
                else
                        res.status(405).json({ 'error': `event with id=${id} is missing` })
        } else {
                res.status(405).json({ 'error': 'id is missing' })
        }

})