import moment from 'moment'

export const initState = {
    Type: 0,
    Category: 0,
    DeskId: 0,
    WorkerId: 0,
    Period: 1,
    FromDate: moment().startOf('month').valueOf(), 
    ToDate: moment().valueOf(),
    Query: ''
}

const getFrom = (p, d) => {
    switch (p) {
        case 0:
            return moment().add(-10, 'Y').valueOf()
        case 1:
            return moment().startOf('month').valueOf()            
        case 2:
            return moment().startOf('quarter').valueOf()  
        case 3:
            return moment().startOf('year').valueOf()
        case 4:
            return d ?? moment().add(-6, 'M').valueOf()
    }
}

const getTo = (p, d) => {
    return p == 4 && d ? d : moment().valueOf()
}


export const reducer = (state, action) => {
    let from = getFrom(state.Period, state.FromDate)  
    let to = getTo(state.Period, state.ToDate)          
    switch (action.type) {
        case "TYPE":
            const type = parseInt(action.param)            
            return {
                ...state,  
                Type: type,
                Category: 0,
                DeskId:0,
                WorkerId: 0,
                Query: `?desk=${0}&worker=${0}&type=${type}&category=${0}&from=${from}&to=${to}`
            }            
        case "CATEGORY":
            const cat = parseInt(action.param)
            return {
                ...state,
                Category: cat,                       
                Query: `?desk=${state.DeskId}&worker=${state.WorkerId}&type=${state.Type}&category=${cat}&from=${from}&to=${to}`
            }
        case "DESK":
            return {
                ...state,
                DeskId: parseInt(action.param),
                Query: `?desk=${state.DeskId}&worker=${state.WorkerId}&type=${state.Type}&category=${state.Category}&from=${from}&to=${to}`
            }
        case "WORKER":
            return {
                ...state,
                WorkerId: parseInt(action.param),
                Query: `?desk=${state.DeskId}&worker=${state.WorkerId}&type=${state.Type}&category=${state.Category}&from=${from}&to=${to}`
            }
        case "PERIOD":
            state = {
                ...state,
                Period: parseInt(action.param),
                FromDate: getFrom(parseInt(action.param))
            }
            from = getFrom(state.Period, state.FromDate)  
            return {
                ...state,
                Query: `?desk=${state.DeskId}&worker=${state.WorkerId}&type=${state.Type}&category=${state.Category}&from=${from}&to=${to}`
            }
        case "FROM":
            state = {
                ...state,
                FromDate: moment(action.param).valueOf()
            }
            from = getFrom(state.Period, state.FromDate)  
            return {
                ...state,
                Query: `?desk=${state.DeskId}&worker=${state.WorkerId}&type=${state.Type}&category=${state.Category}&from=${from}&to=${to}`
            }
        case "TO":
            state = {
                ...state,
                ToDate: moment(action.param).valueOf()
            }
            to = getTo(state.Period, state.ToDate)      
            return {
                ...state,
                Query: `?desk=${state.DeskId}&worker=${state.WorkerId}&type=${state.Type}&category=${state.Category}&from=${from}&to=${to}`
            }
        case "QUERY":
            return {
                ...state,
                Query: `?desk=${state.DeskId}&worker=${state.WorkerId}&type=${state.Type}&category=${state.Category}&from=${from}&to=${to}`
            }
        default:
            return state
    }
}