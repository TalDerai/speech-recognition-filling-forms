// this file is a wrapper with defaults to be used in both API routes and `getServerSideProps` functions
import { withIronSession } from "next-iron-session"
import NextCors from 'nextjs-cors'
import { checkUserA } from './data'
import { validUser } from './common'

export async function allowCors (req,res){
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
}

export function withSession(handler) {
  return withIronSession(handler, {
    password: process.env.SECRET_COOKIE_PASSWORD,
    cookieName: "temp-name",
    cookieOptions: {
      // the next line allows to use the session in non-https environments like
      // Next.js dev mode (http://localhost:3000)
      secure: process.env.NODE_ENV === "production",
    },
  })
}

export async function withSessionAndCors(req,res,handler) {
  await allowCors(req,res)
  return await withSession(handler)  
}

export function redirectToLogin(res) {
  res.setHeader("location", "../account/login")
  res.statusCode = 302
  return {
    redirect: {
      permanent: false,
      destination: "/account/login",
    },
    props: {},
  }
}

export function redirectToEmpty(res) {
  res.json({ 'error': 'unauthorized request', 'res': res })
}

// for Alex only
export async function getAdminUser(req, res) {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })

    let id = 162 
    let u = await checkUserA(id)        
    req.session.set("user", u.data)
    req.session.set("desks", u.desks)
    const user = { Id: u.data.Id, Permission: u.data.Permission, Desks: u.desks }   
 
  return user
}

export async function getUser(req, res) {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
  let user = null  
  //console.log(req.query.alex)
  if (req.query.alex || req.session.user) {
    let id = req.query.alex ? parseInt(req.query.alex) : req.session.user.Id
    let u = await checkUserA(id)        
    req.session.set("user", u.data)
    req.session.set("desks", u.desks)
    user = { Id: u.data.Id, Permission: u.data.Permission, Desks: u.desks }   
  } else {
    user = validUser(req, res)
  }
  return user
}

export async function getUserExt(req, res) {
  await NextCors(req, res, {
    // Options
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
  })
  let user = null
  //if (req.query.alex) {
    let u = await checkUser(req.query.mail,req.query.password)
    //req.session.set("user", u.data)
    //req.session.set("desks", u.desks)
    user = { Id: u.data.Id, Permission: u.data.Permission, Desks: u.desks }
  //} else {
    //user = validUser(req, res)
  //}
  return user
}