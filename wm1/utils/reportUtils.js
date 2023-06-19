import moment from 'moment'
import { getDeskForReport, getDeskEventsForReport } from './data'

const flowItem = (e) => {
    let f = 0, op = 0
    if (e.Amount > 0) {
        f = e.Amount
    } else {
        f = e.Amount + (e.Remainder ?? 0)
        op = (-1) * e.Amount - (e.CloseAmount ?? 0) - (e.Remainder ?? 0)
    }
    return { Flow: f, Opened: op }
}

// desk flow by events
export const deskFlow = async (id, from, to) => {
    const f = from ? parseInt(from) : 0
    const t = to ? parseInt(to) : moment().valueOf()
    // get desk name,startDate and startBalance
    const desk = await getDeskForReport(id)
    // get all events of the desk
    let events = await getDeskEventsForReport(id)
    events = events.map(e => { return { ...e, DateValue: moment(e.Date, 'DD/MM/YYYY').valueOf() } })

    const fromDate = moment(desk.StartDate, 'DD/MM/YYYY').valueOf()
    // calc init desk state    
    const events1 = events.filter(e => e.DateValue >= fromDate && e.DateValue < f)
    let startVal = { Flow: desk.StartBalance, Opened: 0 }
    events1.forEach(e => {
        const fi = flowItem(e)
        startVal.Flow += fi.Flow
        startVal.Opened += fi.Opened
    })
    let data = [{
        Date: moment(f).add(-1, 'd').format('DD/MM/YYYY'),
        Flow: startVal.Flow + startVal.Opened,
        Opened: startVal.Opened,
        Description: 'יתרת פתיחה',
    }]

    // clac flow for every event in the sekected date range
    const events2 = events.filter(e => {
        return e.DateValue >= f && e.DateValue <= t
    })
    events2.forEach((e, i) => {
        const fi = flowItem(e)
        let o = {
            ...e,
            Tp: e.Amount > 0 ? 'הפקדה' : 'משיכה',
            Hova: (e.Amount > 0 ? 0 : ((-1) * e.Amount - (e.Remainder ?? 0))),
            Kniot: e.CloseAmount ?? 0,
            Zhut: (e.Amount > 0 ? e.Amount : 0),
            Flow: data[i].Flow + fi.Flow + fi.Opened,
            Opened: fi.Opened
        }
        data.push(o)
    })
    //console.log(data)
    return data
}

const deskFlowForSummary = async (id, from, to) => {

    return new Promise(async (resolve) => {

        const f = from ? parseInt(from) : 0
        const t = to ? parseInt(to) : moment().valueOf()
        // get desk name,startDate and startBalance
        const desk = await getDeskForReport(id)
        // get all events of the desk
        let events = await getDeskEventsForReport(id)
        events = events.map(e => { return { ...e, DateValue: moment(e.Date, 'DD/MM/YYYY').valueOf() } })
        const fromDate = moment(f).valueOf()
        // calc init desk state    
        const events1 = events.filter(e => e.DateValue >= fromDate && e.DateValue < f)
        let startVal = { Flow: desk.StartBalance, Opened: 0 }
        events1.forEach(e => {
            const fi = flowItem(e)
            startVal.Flow += fi.Flow
            startVal.Opened += fi.Opened
        })
        let data = {
            StartBalance: startVal.Flow,
            Withdrawals: 0,
            Deposits: 0,
            EndBalance: startVal.Flow,
            OpenedEvents: 0,
            OpenedSum: 0
        } 

        // clac flow for every event in the sekected date range
        const events2 = events.filter(e => {
            return e.DateValue >= f && e.DateValue <= t
        })
        events2.forEach((e, i) => {
            const fi = flowItem(e)
            data.Withdrawals += (e.Amount > 0 ? 0 : (-1) * e.Amount)
            data.Deposits += (e.Amount > 0 ? e.Amount : 0)
            data.EndBalance += fi.Flow
            data.OpenedEvents += (fi.Opened === 0 ? 0 : 1)
            data.OpenedSum += fi.Opened
        })
        //return data
        resolve({ ...data, Id: desk.Id, Name: desk.Name })
    })
}

// flow summary by desks
export const deskSummary = (d, from, to) => {
    const f = from ? parseInt(from) : 0
    const t = to ? parseInt(to) : moment().valueOf()
    if (!d.desks) return {}
    const promises = []
    for (let i = 0; i < d.desks.length; i++) {
        promises.push(deskFlowForSummary(d.desks[i].Id, from, to))
    }
    return Promise.all(promises)
}