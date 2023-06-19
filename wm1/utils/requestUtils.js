import { card, list, arc, create, update, checkMail, desksByWorker, workersByDesk, updateWorkerDeskTable } from "./data"

export const getCard = async (req, res, table) => {
    const result = await card(table, req.query.id)
    if (result.error) {
        res.status(405).json({ "error": error.message })
    } else {
        res.status(200).json(result)
    }
}

export const getList = async (user, req, res, table) => {
    const result = await list(user, table, req.query)
    if (result.error) {
        res.status(405).json({ "error": result.error.message })
    } else {
        const { items, amount } = result
        res.status(200).json({ items, amount })
    }
}

export const setArc = async (req, res, table) => {
    const id = req.query.id
    const a = req.query.arc
    const result = await arc(table, id, a)
    res.json(result)
}

export const exeCreate = async (req, res, table) => {
    const result = await create(req.body, table)
    if (result.error)
        res.status(405).json({ "error": result.error })
    else
        res.status(200).json(result)
}

export const exeUpdate = async (req, res, table) => {    
    const result = await update(req.body, table)    
    if (result.error)
        res.status(405).json({ "error": result.error })
    else
        res.status(200).json(result)
}

export const mailExists = async (req, res) => {
    const result = await checkMail(req.query.mail)
    if (result.error) {
        res.status(405).json({ "error": error.message })
    } else {
        res.status(200).json(result)
    }
}


export const getDesksByWorker = async (req, res) => {
    const result = await desksByWorker(req.query.id)
    if (result.error) {
        res.status(405).json({ "error": result.error })
    } else {
        const list = result.map(x => x.Desk)
        res.status(200).json(list)
    }
}

export const getWorkersByDesk = async (req, res) => {
    const result = await workersByDesk(req.query.id)
    if (result.error) {
        res.status(405).json({ "error": result.error })
    } else {
        const list = result.map(x => x.Worker)
        res.status(200).json(list)
    }
}

export const updateWorkerDesk = async (req, res) => {
    const {tp,id,list} = req.body
    const result = await updateWorkerDeskTable(tp,id,list)
    if (result.error) {
        res.status(405).json({ "error": result.error })
    } else {        
        res.status(200).json({"success":"ok"})
    }
}