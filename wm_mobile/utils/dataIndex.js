import stringComparison from 'string-comparison'
import moment from 'moment'
const simType = ['levenshtein', 'lcs', 'mlcs', 'cosine', 'diceCoefficient', 'jaccardIndex']

const calcDates = (p) => {
    let to = moment().valueOf()
    let from = {
        month: moment().startOf('month').valueOf(),
        quarter: moment().startOf('quarter').valueOf(),
        year: moment().startOf('year').valueOf(),
        all: moment().add(-10, 'Y').valueOf()
    }
    return { to, from: from[p] }
}

export default class DataIndex {
    constructor(template, entities, stp = 0, index = null) {
        this.ls = stringComparison[simType[stp]]
        this.template = template
        this.entities = entities
        if (index) {
            this.index = index
        } else {
            this.init1()
            this.init2()
            this.index = { ...this.entriesWithoutParam, ...this.entriesWithParam }            
        }
        //console.log(this.index)
        //console.log(Object.keys(this.index).length)
    }
    init1() { // items w/o params
        const _this = this.template
        let o = { ..._this.list.entities, ..._this.newCard }
        let obj = {}
        Object.entries(o).forEach(([k, ar]) => {
            ar.forEach(a => {
                obj[a] = k
            })
        })
        this.entriesWithoutParam = obj
    }
    init2() { // items with 1 param
        let listAndFilter = {}
        let obj = {}
        const _this = this.template
        // prepare
        Object.entries(_this.list.entities).forEach(([k1, ar1]) => {
            if (k1.indexOf('/events') > -1) {
                ar1.forEach(a1 => {
                    Object.entries(_this.list.filter).forEach(([k2, ar2]) => {
                        ar2.forEach(a2 => {
                            const k = k1 + ((k1.indexOf('?') > -1 ? '&' : '?') + k2)
                            const a = a1 + ' ' + a2
                            listAndFilter[a] = k
                        })
                    })
                })
            }
        })
        Object.entries(_this.card).forEach(([k, ar]) => {
            ar.forEach(a => {
                listAndFilter[a] = k
            })
        })
        // 
        Object.entries(listAndFilter).forEach(([k, v]) => {
            if (v.indexOf('worker=$id') > -1 || v.indexOf('/workerCard?id=$id') > -1) {
                this.entities.workers.forEach(d => {
                    obj[k + ' ' + d.Id] = v.replace('$id', d.Id)
                })
            } else if (v.indexOf('worker=$name') > -1 || v.indexOf('/workerCard?id=$name') > -1) {
                this.entities.workers.forEach(d => {
                    obj[k + ' ' + d.Name1] = v.replace('$name', d.Id)
                    obj[k + ' ' + d.Name2] = v.replace('$name', d.Id)
                })
            } else if (v.indexOf('desk=$id') > -1 || v.indexOf('/deskCard?id=$id') > -1) {
                this.entities.desks.forEach(d => {
                    obj[k + ' ' + d.Id] = v.replace('$id', d.Id)
                })
            } else if (v.indexOf('desk=$name') > -1 || v.indexOf('/deskCard?id=$name') > -1) {
                this.entities.desks.forEach(d => {
                    obj[k + ' ' + d.Name] = v.replace('$name', d.Id)
                })
            }
        })
        // reports
        Object.keys(this.template.report).forEach((k, i) => {
            if (i == 0) {   // kartis kupa
                _this.report[k].forEach(a => { // rep name
                    this.entities.desks.forEach(d => { // desk name
                        Object.entries(_this.repPeriod).forEach(([key, val]) => {
                            let { from, to } = calcDates(key)
                            val.forEach(pr => {
                                _this.repForPeriod.forEach(fp => {
                                    obj[ a + ' ' + d.Name + ' ' + fp + ' ' + pr] = k + '&desk=' + d.Id + '&from=' + from + '&to=' + to
                                })
                            })
                        })
                    })
                })
            } else {      // maazan kupot
                _this.report[k].forEach(a => { // rep name
                    Object.entries(_this.repPeriod).forEach(([key, val]) => {
                        let { from, to } = calcDates(key)
                        val.forEach(pr => {
                            _this.repForPeriod.forEach(fp => {
                                obj[a + ' ' + fp + ' ' + pr] = k + '&desk=0&from=' + from + '&to=' + to
                            })
                        })
                    })
                })
            }
        })
        this.entriesWithParam = obj
    }
    find(str, n = 5) {
        let arr = []
        Object.entries(this.index).forEach(([k, v]) => {
            arr.push({ key: k, path: v, sim: this.ls.similarity(str, k) })
        })
        return arr.sort((a1, a2) => a2.sim - a1.sim).slice(0, n)
    }
    findBest(str) {
        return this.find(str, 1)[0]
    }
    findExactBySubstring(str, n = 10) {
        let arr = []
        Object.entries(this.index).forEach(([k, v]) => {
            if (k.indexOf(str) > -1) {
                arr.push({ key: k, path: v, sim: this.ls.similarity(str, k) })
            }
        })
        return arr.sort((a1, a2) => a2.sim - a1.sim).slice(0, n)
    }
    similarity(s1, s2) {
        return this.ls.similarity(s1, s2)
    }
}