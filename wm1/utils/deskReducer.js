import moment from "moment"

export const initState = {}
 
export const reducer = (state, action) => {
    switch (action.type) {
        case "INIT":
            return { 
                ...action.param
            }
        case "UPDATE":
            return {
                ...state,
                Account: action.param.Account,
                AccountName: action.param.AccountName,
                Bank: action.param.Bank,
                Branch: action.param.Branch,
                Comments: action.param.Comments,               
                Name: action.param.Name,
                StartBalance: action.param.StartBalance,
                StartDate: moment(action.param.StartDate, 'DD/MM/YYYY').valueOf()
            }
        case "ARCHIVE":
            return {
                ...state,
                Archive: action.param
            }
        case "DESKEVENTS":
            return {
                ...state,
                DeskEvents: action.param
            }
        case "DESKBALANCE":
            return {
                ...state,
                DeskBalance: action.param
            }   
        case "DATE":
            return {
                ...state,
                StartDate: action.param 
            }
        default:
            return state
    }
}