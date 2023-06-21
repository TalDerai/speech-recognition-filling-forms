import sqlite3 from 'sqlite3'
import { open } from 'sqlite'
import { createString, updateString, listString, cardString, reportString } from './dataUtils'
import moment from 'moment'

// access db
export const openDb = async () => {
  return open({
    filename: './db/walletm.db',
    driver: sqlite3.Database
  })
}

// crud operations
// all data items
export const list = async (user, table, query) => {
  const db = await openDb()
  const sql = listString(user, table, query)
  try {
    const items = await db.all(sql[0])
    const amount = (await db.all(sql[1]))[0].Cnt
    return { items, amount }
  } catch (error) {
    return { "error": error.message, "sql": sql }
  }
}

// desks and workers - for ddl
export const desksAndWorkers = async (user) => {
  const db = await openDb()
  try {   
    const sql1 = `SELECT Id, (FirstName || ' ' || LastName) AS Name FROM Worker WHERE Archive=0 OR Archive IS NULL ORDER BY Name`
    const workers = await db.all(sql1)

    const sql2 = user.Permission === 3
      ? `SELECT Id, Name FROM Desk WHERE Archive=0 OR Archive IS NULL ORDER BY Name`
      : `SELECT Id, Name FROM Desk WHERE Id IN (SELECT Desk FROM WorkerDesk WHERE Worker=${user.Id} AND (Archive=0 OR Archive IS NULL)) ORDER BY Name`
    const desks = await db.all(sql2)

    return { workers, desks }
  } catch (error) {
    return { "error": error.message, "sql": "deskAndWorkers" }
  }
}

// item by id
const getCard = async (table, id) => {
  const db = await openDb()
  const sql = cardString(table, id)
  const data = await db.all(sql)
  return data[0]
}

export const card = async (table, id) => {
  try {
    const data = await getCard(table, id)
    return data
  } catch (error) {
    return { "error": error.message }
  }
}

// add/rem to/from arc
export const arc = async (table, id, a) => {
  const db = await openDb()
  const sql = `UPDATE ${table} SET Archive = ${a} WHERE Id = ${id}`
  try {
    await db.run(sql)
    return { 'message': sql }
  } catch (e) {
    return { 'error': `error in execution: ${sql}` }
  }
}

// add/rem file to/from arc
export const arcFile = async (id, arc) => {
  const db = await openDb()
  if (!id) return { 'error': 'id is missing' }
  const sql = `UPDATE ExFile SET Archive = 1-Archive WHERE Id = ${id}`
  try {
    await db.run(sql)
    return { 'message': `File ${id} archive is ${arc}` }
  } catch (e) {
    return { 'error': `error in execution: ${sql}` }
  }
}

// create new item
export const create = async (body, table) => {
  const db = await openDb()
  let sql = "not created"
  try {
    sql = createString(table, body)
    return await db.run(sql)
  } catch (error) {
    return { "error": error.message, "sql": sql }
  }
}

// update existing item
export const update = async (body, table) => {
  const db = await openDb()
  let sql = "not created"
  try {    
    sql = updateString(table, body)  
    if (sql == "") return { "error": "נתונים אינם תקינים" }
    return await db.run(sql)
  } catch (error) {
    return { "error": error.message, "sql": sql }
  }
}

// get event files
export const files = async (id) => {
  const db = await openDb()
  if (!id) return { 'error': 'id is missing' }
  const sql = `SELECT Id, Name FROM ExFile WHERE Archive=0 AND Event=${id}`
  const result = await db.all(sql)
  if (result.error) {
    return { 'error': `error executing: ${sql} ` }
  } else {
    return result
  }
}

// get desk balance
export const deskBalance = async (id) => {
  const db = await openDb()
  const sql = `SELECT D.Id, (StartBalance + IIF(SUM(E.Amount) IS NULL,0,SUM(E.Amount)) + IIF(SUM(E.CloseAmount) IS NULL,0,SUM(E.CloseAmount)) + IIF(SUM(E.Remainder) IS NULL,0,SUM(E.Remainder))) AS Balance FROM Desk D left join Event E ON D.Id=E.Desk WHERE D.Id = ${id}`
  const data = await db.all(sql)
  return data[0]
}

//get desk events
export const deskEvents = async (id) => {
  const db = await openDb()
  const sql = `SELECT Id, COUNT(Id) AS Events FROM Event WHERE Desk = ${id}`
  const data = await db.all(sql)
  if (data[0] && data[0].Id)
    return data[0]
  else
    return { 'Id': parseInt(id), 'Events': 0 }
}

// get report data
export const report = async (params) => {
  const title = ['כרטסת קופה', 'מאזן תנועות בקופות']
  const cat = ['כל האירועים', 'אירועים סגורים', 'אירועים פתוחים', 'הפקדות', 'משיכות', 'אירועים בארכיון']

  const db = await openDb()

  const d2 = await db.all(`SELECT Id,Name,StartBalance,StartDate FROM DESK WHERE Archive=0 OR Archive IS NULL`)

  let com = {}
  if (params.desk === '0')
    com['Desk'] = 'כל הקופות'
  else {
    const n = d2.findIndex(d => d.Id == parseInt(params.desk))
    com['Desk'] = d2.find(d => d.Id == parseInt(params.desk)).Name 
  }

 //if (params.worker === '0')
    com['Worker'] = 'כל העובדים'
  /* else {
    const ws = await db.all(`SELECT FirstName || ' ' || LastName AS Name FROM Worker WHERE Id=${params.worker}`)
    com['Worker'] = ws[0].Name
  } */

  com['From'] = moment(parseInt(params.from)).format('DD/MM/YYYY')
  com['To'] = moment(parseInt(params.to)).format('DD/MM/YYYY')
  com['Title'] = title[parseInt(params.type)]
  com['Category'] = cat[parseInt(params.category)]
  com['Type'] = parseInt(params.type)

  return { 'desks': d2, 'com': com }
}

// check if worker mail exists
export const checkMail = async (mail) => {
  const db = await openDb()
  try {
    const workers = await db.all(`SELECT COUNT(Id) AS Amount FROM Worker WHERE Mail = '${mail}'`)
    return workers[0].Amount > 0
  } catch (error) {
    return { "error": error.message, "sql": "checkMail" }
  }
}

// check and get user for login
export const checkUser = async (mail, password) => {
  const db = await openDb()
  try {
    const workers = await db.all(`SELECT Id, Mail, FirstName || ' ' || LastName AS Name, Position, Permission, Image FROM Worker WHERE Mail = '${mail}' AND Password = '${password}'`)
    const desks = await db.all(`SELECT Desk FROM WorkerDesk WHERE Worker = ${workers[0].Id}`)
    return { data: workers[0], desks: desks.map(d => d.Desk) }
  } catch (error) {
    return { "error": error.message, "sql": "checkUser" }
  }
}

export const checkUserExt = async (req)=>{
  let user
  if(req.session.get('user')){
          user = req.session.get("user")
  }else if(req.query.alex && req.query.mail && req.query.password){
          const mail  = req.query.mail
          const password  = req.query.password
          user = await checkUser(mail,password)    
  }
  return user
}

export const checkUserA = async (id) => {
  const db = await openDb()
  try {
    const workers = await db.all(`SELECT Id, Mail, FirstName || ' ' || LastName AS Name, Position, Permission, Image FROM Worker WHERE Id = ${id}`)    
    const desks = await db.all(`SELECT Desk FROM WorkerDesk WHERE Worker = ${workers[0].Id}`)    
    return { data: workers[0], desks: desks.map(d => d.Desk) }    
  } catch (error) {
    return { "error": error.message, "sql": "checkUser" }
  }
}

// get desks by worker
export const desksByWorker = async (id) => {
  const db = await openDb()
  try {
    return await db.all(`SELECT Desk FROM WorkerDesk WHERE Worker = ${id}`)
  } catch (error) {
    return { "error": error.message, "sql": "desksByWorker" }
  }
}

// get workers by desk
export const workersByDesk = async (id) => {
  const db = await openDb()
  try {
    const sql = `select W.Id AS Worker FROM Worker W 
                left join WorkerDesk A ON A.Worker=W.Id 
                WHERE A.Desk = ${id} AND (W.Archive IS NULL OR W.Archive = 0)`
    return await db.all(sql)
  } catch (error) {
    return { "error": error.message, "sql": "workersByDesk" }
  }
}

// update desk-worker relations table
export const updateWorkerDeskTable = async (tp, id, list) => {
  const db = await openDb()
  try {
    if (tp === 'desk') {
      await db.run(`delete from WorkerDesk where Desk=${id}`)
      if (list.length > 0) {
        let sql1 = list.map(x => `(${id},${x})`).join(',')
        sql1 = `INSERT INTO WorkerDesk (Desk,Worker) VALUES ${sql1}`
        await db.run(sql1)
      }
    } else {
      await db.run(`delete from WorkerDesk where Worker=${id}`)
      if (list.length > 0) {
        let sql2 = list.map(x => `(${x},${id})`).join(',')
        sql2 = `INSERT INTO WorkerDesk (Desk,Worker) VALUES ${sql2}`
        await db.run(sql2)
      }
    }
    // prevent duplicates from previous updates
    const remDuplicate = `DELETE FROM WorkerDesk WHERE rowid NOT IN (SELECT MIN(rowid) FROM WorkerDesk GROUP BY Worker,Desk)`
    await db.run(remDuplicate)
    return { "success": "ok" }
  } catch (error) {
    return { "error": error.message, "sql": "updateWorkerDesk" }
  }
}

// desk init data
export const getDeskForReport = async (id) => {
  const db = await openDb()
  try {
    //console.log('222',`SELECT Name, StartBalance, StartDate FROM Desk WHERE Id=${id}`)
    //return {}
    const desks = await db.all(`SELECT Id, Name, StartBalance, StartDate FROM Desk WHERE Id=${id}`)
    return desks[0]
  } catch (error) {
    return { "error": error.message, "sql": "getDeskForReport" }
  }
}

// desk events
export const getDeskEventsForReport = async (id) => {
  const db = await openDb()
  try {       
    const events = await db.all(`SELECT Event.Id, Event.Date, Event.Amount, Event.Worker, Event.CloseAmount, 
        Event.Remainder, Event.CloseWorker, Event.Description,   
        Event.Worker AS "WorkerId", W.WorkerName as "Worker", Event.Desk AS "DeskId", D.Name AS "Desk" FROM Event  
        LEFT JOIN (SELECT Id, Name FROM Desk) D ON D.Id = Event.Desk
        LEFT JOIN (SELECT Id, FirstName || ' ' || LastName AS "WorkerName" FROM Worker) W ON W.Id = Event.Worker 
        WHERE Event.Desk = ${id} 
        ORDER BY date(substr(Event.Date,7,4)||"-"||substr(Event.Date,4,2)||"-"||substr(Event.Date,1,2)) ASC`)
    return events
  } catch (error) {
    return { "error": error.message, "sql": "getDeskEventsForReport" }
  }
}

// get events, desks, workers
export const userStatistics = async (permission, id) => {
  const db = await openDb()
  let events = 0, opened = 0, desks = 0, workers = 0
  try {
    if(permission===3){ // manager
      events = await db.all(`SELECT COUNT(Id) AS Cnt FROM Event WHERE (Archive=0 OR Archive IS NULL)`)
      opened = await db.all(`SELECT COUNT(Id) AS Cnt FROM Event WHERE Amount<0 AND 
                            (Remainder IS NULL OR CloseAmount IS NULL OR (-1)*Amount > Remainder+CloseAmount) AND (Archive=0 OR Archive IS NULL)`)
      desks = await db.all(`SELECT COUNT(Id) AS Cnt FROM Desk WHERE (Archive=0 OR Archive IS NULL)`)
      workers = await db.all(`SELECT COUNT(Id) AS Cnt FROM Worker WHERE (Archive=0 OR Archive IS NULL)`)      
      return {
          events:events.length>0 ? events[0].Cnt : 0,
          opened:opened.length>0 ? opened[0].Cnt : 0 ,
          desks:desks.length>0 ? desks[0].Cnt : 0,
          workers:workers.length>0 ? workers[0].Cnt : 0}  
    }else{
      events = await db.all(`SELECT COUNT(Id) AS Cnt FROM Event WHERE (Archive=0 OR Archive IS NULL)`)
      opened = await db.all(`SELECT COUNT(Id) AS Cnt FROM Event WHERE Amount<0 AND Worker = ${id} AND  
                            (Remainder IS NULL OR CloseAmount IS NULL OR (-1)*Amount > Remainder+CloseAmount) AND (Archive=0 OR Archive IS NULL)`)
      desks = await db.all(`SELECT COUNT(Id) AS Cnt FROM WorkerDesk WHERE Worker = ${id}`)
      return {
        events:events.length>0 ? events[0].Cnt : 0,
        opened:opened.length>0 ? opened[0].Cnt : 0 ,
        desks:desks.length>0 ? desks[0].Cnt : 0,
        workers: 0}  
    }
  } catch (error) {
    return { "error": error.message, "sql": "userStatistics" }
  }
}

// data for STT
export const sttData = async () => {
  const db = await openDb()
  const sql1 = 'SELECT Id, Name FROM Desk WHERE Archive=0 OR Archive IS NULL'
  const sql2 = "SELECT Id, FirstName || ' ' || LastName AS Name1, LastName || ' ' || FirstName AS Name2 FROM Worker WHERE Archive=0 OR Archive IS NULL ORDER BY Name1"
  try {
    const desks = await db.all(sql1)
    const workers = await db.all(sql2)
    return { desks, workers }
  } catch (error) {
    return { "error": error.message, "sql": 'sttData' }
  }
}
