export const initState = {
    page: 1,
    size: 20,
    sort: 'Date',
    dir: 'DESC',
    key: '',
    arc: 'all'
}

export const initEventState = {
    ...initState,
    type: 'opened',
    worker: '',
    desk: ''
}

export const reducer = (state, action) => {
    switch (action.type) {
        case "SORT":
            return {
                ...state,
                page: 1,
                sort: action.param,
                dir: state.dir === 'ASC' ? 'DESC' : 'ASC'
            }
        case "PAGE":
            let np = action.param
            return {
                ...state,
                page: np < 0 ? (state.page + np + 2) : np
            }
        case "SEARCH":
            return {
                ...state,
                page: 1,
                key: action.param.target.value
            }
        case "CLEAR_SEARCH":
            return {
                ...state, 
                page: 1,
                key: ''
            }
        case "ARC":
            return {
                ...state,
                page: 1,
                arc: action.param 
            } 
        case "C-TYPE":
            return {
                ...state,
                page: 1,                
                type: action.param
            }
        case "C-DESK":
            return {
                ...state,
                page: 1,
                desk: action.param
            }
        case "C-WORKER":
            return {
                ...state,
                page: 1,
                worker: action.param 
            }
        case "C-RESET":
            return {
                ...state,
                page: 1,
                type: 'opened',
                arc: 'all',
                key: '',
                worker: '',
                desk: ''
            }
        default:
            return state
    }
}