import {withSession} from "./session"

export const getUser = withSession(async function (req){
    return await req.session.get("user")    
})