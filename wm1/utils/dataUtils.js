import moment from 'moment'

export const createString = (table, body) => {
    switch (table) {
        case 'Event':
            return `INSERT INTO Event(Date,Amount,Method,Worker,Desk,Description,Comments,Archive) 
                    VALUES ('${body.Date}',${body.Amount},${body.Method ?? 3},${body.Worker},
                                ${body.Desk},'${body.Description}','${body.Comments ?? ""}',0) returning Id`
        case 'Desk':
            return `INSERT INTO Desk(Name,Bank,Branch,Account,AccountName,StartDate,StartBalance,Comments,Archive) 
                VALUES ('${body.Name}','${body.Bank}','${body.Branch}','${body.Account}','${body.AccountName}',
                                '${body.StartDate}',${body.StartBalance},'${body.Comments}',0) returning Id`
        case 'Worker':
            return `INSERT INTO Worker(FirstName,LastName,Sn,Phone,Mail,Password,Position,Permission,Comments,Archive) 
                VALUES ('${body.FirstName}','${body.LastName}','${body.Sn}','${body.Phone}','${body.Mail}',
                        '${body.Password}','${body.Position}',1,'${body.Comments}',0) returning Id`
        default:
            return ''
    }
}

export const updateString = (table, body) => {
    switch (table) {
        case 'Event':
            return `UPDATE Event SET 
                    Date='${body.Date}', 
                    Amount=${body.Amount}, 
                    Method=${body.Method ?? 3}, 
                    Worker=${body.Worker}, 
                    Desk=${body.Desk}, 
                    ${body.Date ? `Date="${body.Date}",` : ''}
                    ${body.CloseDate ? `CloseDate="${body.CloseDate}",` : ''} 
                    ${body.CloseAmount ? `CloseAmount=${body.CloseAmount},` : ''} 
                    ${body.Remainder ? `Remainder=${body.Remainder},` : 'Remainder=0,'} 
                    ${body.CloseDescription ? `CloseDescription="${body.CloseDescription}",` : ''} 
                    ${body.CloseWorker ? `CloseWorker="${body.CloseWorker}",` : ''}                     
                    Description='${body.Description ?? ""}',                     
                    Comments='${body.Comments ?? ""}' 
                    WHERE Id = ${body.Id} RETURNING *`
        case 'Desk':
            if (!moment(body.StartDate, 'DD/MM/YYYY', true).isValid()) return ''
            return `UPDATE Desk SET 
                    Name='${body.Name}', 
                    Bank='${body.Bank}', 
                    Branch='${body.Branch}', 
                    Account='${body.Account}', 
                    AccountName='${body.AccountName}', 
                    StartDate='${body.StartDate}',
                    StartBalance=${body.StartBalance},                     
                    Comments='${body.Comments}' 
                    WHERE Id = ${body.Id} RETURNING *`
        case 'Worker':
            return `UPDATE Worker SET 
                    FirstName='${body.FirstName}', 
                    LastName='${body.LastName}', 
                    Sn='${body.Sn}', 
                    Phone='${body.Phone}', 
                    Mail='${body.Mail}', 
                    Password='${body.Password}', 
                    Position='${body.Position}', 
                    Permission='${body.Permission}', 
                    Comments='${body.Comments}' 
                    WHERE Id = ${body.Id} RETURNING *`
        default:
            return ''
    }
}

const sortExpression = (qs) => {
    if (qs === 'Date' || qs === 'CloseDate')
        return `date(substr(${qs},7,4)||"-"||substr(${qs},4,2)||"-"||substr(${qs},1,2))`
    else
        return qs
}

export const listString = (user, table, query) => {
    if (!user || !user.Id) return ''
    let userConstrains = ''
    const limit = query.limit ?? 1000000
    const skip = query.skip ?? 0
    let arc = {
        'arc': ' WHERE Archive=1 ',
        'all': ' WHERE (Archive=0 OR Archive IS NULL) '
    }
    const filterDesk = query.desk ? ` AND Desk = ${query.desk} ` : ''
    const filterWorker = query.worker ? ` AND Worker = ${query.worker} ` : ''
    const filterType = {
        'all': ' AND (Archive IS NULL OR Archive <> 1) ',
        'opened': ' AND Amount<0 AND (Remainder IS NULL OR CloseAmount IS NULL OR (-1)*Amount > Remainder+CloseAmount) AND (Archive IS NULL OR Archive <> 1)',
        'closed': ' AND Amount<0 AND (-1)*Amount = Remainder+CloseAmount AND (Archive IS NULL OR Archive <> 1)',
        'deposit': ' AND Amount > 0 AND (Archive IS NULL OR Archive <> 1)',
        'withdrawal': ' AND Amount < 0 AND (Archive IS NULL OR Archive <> 1)',
        'arc': ' AND Archive = 1'
    }

    let sort = table == 'Event' ? sortExpression(query.sort ?? 'Date') : 'Id'
    const dir = query.dir ?? 'DESC'
    let search = ''

    switch (table) {
        case 'Event':
            if (sort === "Id") sort = "Event.Id"
            if (query.key) {
                search = ` AND (Description LIKE '%${query.key}%' OR Worker LIKE '%${query.key}%' OR Desk LIKE '%${query.key}%' 
                        OR W.WorkerName LIKE '%${query.key}%' OR D.Name LIKE '%${query.key}%' )`
            }
            userConstrains = user.Permission === 3 ? '' : ` AND Event.Desk IN (SELECT Desk FROM WorkerDesk WHERE Worker = ${user.Id}) `
            return [`SELECT Event.Id, Description, IIF(Amount>0,Amount, Amount+IIF(Remainder IS NULL,0,Remainder)) AS Amount, Date, CloseAmount, 
                    IIF(Amount>0,0,(Amount + IIF(CloseAmount IS NULL,0,CloseAmount) + IIF(Remainder IS NULL,0,Remainder))*(-1)) AS Opened, CloseDate, Comments, 
                    Worker AS "WorkerId", W.WorkerName as "Worker", Desk AS "DeskId", D.Name AS "Desk",
                    IIF(Archive=1,3,IIF(Amount>0,0,IIF(Amount + IIF(CloseAmount IS NULL,0,CloseAmount) + IIF(Remainder IS NULL,0,Remainder)<0,1,2))) AS Status 
                    FROM Event
                    LEFT JOIN (SELECT Id, Name FROM Desk) D ON D.Id = Event.Desk
                    LEFT JOIN (SELECT Id, FirstName || ' ' || LastName AS "WorkerName" FROM Worker) W ON W.Id = Event.Worker WHERE true                    
                     ${filterDesk} ${filterWorker} ${filterType[query.type ?? 'all']} ${search} ${userConstrains} 
                    ORDER BY ${sort} ${dir} LIMIT ${limit} OFFSET ${skip}`,
            `SELECT COUNT(Event.Id) AS Cnt FROM Event
                    LEFT JOIN (SELECT Id, Name FROM Desk) D ON D.Id = Event.Desk
                    LEFT JOIN (SELECT Id, FirstName || ' ' || LastName AS "WorkerName" FROM Worker) W ON W.Id = Event.Worker WHERE true
                    ${filterDesk} ${filterWorker} ${filterType[query.type ?? 'all']} ${search} ${userConstrains}`]
        case 'Desk':
            if (query.key) {
                search = ` AND Name LIKE '%${query.key}%' `
            }
            userConstrains = user.Permission === 3 ? '' : ` AND Desk.Id IN (SELECT Desk FROM WorkerDesk WHERE Worker = ${user.Id}) `
            return [`SELECT Id, Name, Bank, Branch, Account, IIF(B.Events IS NULL,0,B.Events) AS Events, IIF(WD.Workers IS NULL,0,WD.Workers) AS Workers, IIF(B.Deposit IS NULL,0,B.Deposit) AS Deposit, IIF(B.Withdrawal IS NULL,0,B.Withdrawal) AS Withdrawal, IIF(B.Remainder IS NULL,0,B.Remainder) AS Remainder, (StartBalance + IIF(B.Amount IS NULL,0,B.Amount) + IIF(B.Remainder IS NULL,0,B.Remainder)) as "Balance", Archive FROM Desk LEFT JOIN (SELECT Desk, COUNT(Id) AS "Events", SUM(IIF(Amount IS NULL,0,Amount)) AS "Amount", SUM(IIF(Remainder IS NULL,0,Remainder)) AS Remainder, SUM(IIF(Amount>0,Amount,0)) AS Deposit, SUM(IIF(Amount<0,Amount,0))*(-1) AS Withdrawal FROM Event GROUP BY Desk) B ON Desk.Id = B.Desk LEFT JOIN (SELECT Desk, COUNT(Id) AS "Workers" FROM WorkerDesk GROUP BY Desk) WD ON WD.Desk = Desk.Id ${arc[query.arc ?? 'all']} ${search}  ${userConstrains} ORDER BY ${sort} ${dir} LIMIT ${limit} OFFSET ${skip}`,
            `SELECT COUNT(Id) AS Cnt FROM Desk
                    LEFT JOIN (SELECT Desk, COUNT(Id) AS "Events" FROM Event GROUP BY Desk) B ON Desk.Id = B.Desk
                    ${arc[query.arc ?? 'all']} ${search}  ${userConstrains}`]
        case 'Worker':
            if (query.key) {
                search = ` AND (FirstName LIKE '%${query.key}%' OR LastName LIKE '%${query.key}%' OR 
                            Mail LIKE '%${query.key}%' OR Sn LIKE '%${query.key}%' OR Phone LIKE '%${query.key}%')`
            }
            return [`SELECT Id, FirstName, LastName, Sn, Position, Permission, Mail, Phone, B.Events, IIF(WD.Desks IS NULL,0,WD.Desks) AS Desks, Image, Archive FROM Worker
                    LEFT JOIN (SELECT Worker, COUNT(Id) AS "Events" FROM Event GROUP BY Worker) B ON Worker.Id = B.Worker 
                    LEFT JOIN (SELECT Worker, COUNT(Id) AS "Desks" FROM WorkerDesk GROUP BY Worker) WD ON WD.Worker = Worker.Id  
                    ${arc[query.arc ?? 'all']} ${search}  
                    ORDER BY ${sort} ${dir} LIMIT ${limit} OFFSET ${skip}`,
            `SELECT COUNT(Id) AS Cnt FROM Worker
                    LEFT JOIN (SELECT Worker, COUNT(Id) AS "Events" FROM Event GROUP BY Worker) B ON Worker.Id = B.Worker 
                    ${arc[query.arc ?? 'all']} ${search}`]
        default:
            return ''
    }
}

export const cardString = (table, id) => {
    switch (table) {
        case 'Event':
            return `SELECT Event.Id, Description, IIF(Comments IS NULL,'',Comments) AS Comments, CloseDescription, Amount, IIF(Method IS NULL,3,Method) AS Method, Date, CloseAmount, Remainder, CloseDate,
                     Worker AS "WorkerId", W.WorkerName as "Worker", Desk AS "DeskId", D.Name AS "Desk", Archive FROM Event
                     LEFT JOIN (SELECT Id, Name FROM Desk) D ON D.Id = Event.Desk
                     LEFT JOIN (SELECT Id, FirstName || ' ' || LastName AS "WorkerName" FROM Worker) W ON W.Id = Event.Worker WHERE Event.Id=${id}`
        case 'Desk':
            return `SELECT Id, Name, Bank, Branch, Account, AccountName, StartBalance, StartDate, Comments, Archive FROM Desk                     
                    WHERE Id=${id}`
        case 'Worker':
            return `SELECT Id, FirstName, LastName, Sn, Position, Permission, Mail, Password, Phone, B.Events, Image, Comments, Archive FROM Worker
                     LEFT JOIN (SELECT Worker, COUNT(Id) AS "Events" FROM Event GROUP BY Worker) B ON Worker.Id = B.Worker WHERE Id=${id}`
        default:
            return ''
    }
}

export const reportString = (param) => {
    const { type, category, worker, desk, from, to } = param
    const t = parseInt(type)
    const c = parseInt(category)
    const w = parseInt(worker)
    const d = parseInt(desk)

    const filterDesk = d === 0 ? '' : ` AND Desk = ${d}`
    const filterCategory = [
        '', // all
        ' AND Amount<0 AND (-1)*Amount = Remainder+CloseAmount ', //closed
        ' AND Amount<0 AND (-1)*Amount > Remainder+CloseAmount ', //opened
        ' AND Amount>0 ',   // deposits
        ' AND Amount<0 ',   // withdrawals
        ' AND Archive = 1'  // arc
    ]
    const filterWorker = w === 0 ? '' : ` AND Event.Worker = ${w} `
    const filterDates = c === 0 ? '' : ` AND DATE(SUBSTR(Event.Date, 7, 4) || '-' || SUBSTR(Event.Date, 4, 2) || '-' || SUBSTR(Event.Date, 1, 2)) 
        BETWEEN  DATE('${moment(parseInt(from)).add(1, 'd').format('YYYY-MM-DD')}') and DATE('${moment(parseInt(to)).format('YYYY-MM-DD')}') `

    return `SELECT Event.Id, Event.Description, Event.Amount, Event.Date, 
            Event.CloseAmount, Event.Remainder, Event.CloseDate,
            Event.Worker AS "WorkerId", W.WorkerName as "Worker", Event.Desk AS "DeskId", D.Name AS "Desk", Event.Archive FROM Event
            LEFT JOIN (SELECT Id, Name FROM Desk) D ON D.Id = Event.Desk
            LEFT JOIN (SELECT Id, FirstName || ' ' || LastName AS "WorkerName" FROM Worker) W ON W.Id = Event.Worker 
            WHERE true ${filterDates} ${filterDesk} ${filterCategory[c]} ${filterWorker} 
            ORDER BY date(substr(Event.Date,7,4)||"-"||substr(Event.Date,4,2)||"-"||substr(Event.Date,1,2)) ASC`

}
