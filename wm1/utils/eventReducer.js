import moment from "moment"
import { getStatus } from "./eventCardUtils"

export const initState = {}

export const reducer = (state, action) => {
    switch (action.type) {
        case "INIT":
            return {
                ...action.param,
                IsOpened: action.param.isDep || (action.param.Amount - (action.param.CloseAmount ?? 0) - (action.param.Remainder ?? 0) != 0),
                Ietra: action.param.Amount - (action.param.CloseAmount ?? 0) - (action.param.Remainder ?? 0),
                Disabled: action.param.Permission === 1 || action.param.DesksAmount === 0 || action.param.Archive === 1 || !action.param.IsOpened ? true : false,
                Status: getStatus(action.param)
            }
        case "RESTORE":
            return {
                ...action.param
            }
        case "UPDATE":
            return {
                ...state,
                //IsOpened: state.isDep || (state.Amount - (state.CloseAmount ?? 0) - (state.Remainder ?? 0) != 0),
                Disabled: state.Permission === 1 || state.DesksAmount === 0 || state.Archive === 1 || !state.IsOpened ? true : false,
                Ietra: state.Amount - (state.CloseAmount ?? 0) - (state.Remainder ?? 0),
                Status: getStatus(state)
            }
        case "ADM_CLOSE":
            return {
                ...state,
                IsOpened: false
            }
        case "ADM_OPEN":
            return {
                ...state,
                IsOpened: true,
            }
        case "ARCHIVE":
            return {
                ...state,
                Archive: action.param
            }
        case "DESCRIPTION":
            return {
                ...state,
                Description: action.param
            }
        case "DESK":
            return {
                ...state,
                DeskId: action.param
            }
        case "WORKER":
            return {
                ...state,
                WorkerId: action.param
            }
        case "AMOUNT":
            return {
                ...state,
                Amount: action.param,
                Ietra: action.param - (state.CloseAmount ?? 0) - (state.Remainder ?? 0)
            }
        case "METHOD":
            return {
                ...state,
                Method: action.param
            }
        case "DATE":
            return {
                ...state,
                Date: action.param
            }
        case "COMMENTS":
            return {
                ...state,
                Comments: action.param
            }
        case "CLOSE_AMOUNT":
            return {
                ...state,
                CloseAmount: action.param,
                Ietra: state.Amount - (action.param ?? 0) - (state.Remainder ?? 0),
            }
        case "REMAINDER":
            return {
                ...state,
                Remainder: action.param,
                Ietra: state.Amount - (state.CloseAmount ?? 0) - (action.param ?? 0),
            }
        case "CLOSE_DATE":
            return {
                ...state,
                CloseDate: action.param
            }
        case "CLOSE_DESCRIPTION":
            return {
                ...state,
                CloseDescription: action.param
            }
        case "DESK_BALANCE":
            return {
                ...state,
                DeskBalance: action.param
            }
        case "SUBMIT":
            return {
                ...state,
                Amount: Math.abs(action.param.Amount),
                Date: moment(action.param.Date, 'DD/MM/YYYY').valueOf(),
                CloseDate: action.param.CloseDate ? moment(action.param.CloseDate, 'DD/MM/YYYY').valueOf() : moment().valueOf() ,
                IsOpened:  action.param.Amount * (action.param.Amount<0 ? -1 : 1) - (action.param.CloseAmount ?? 0) - (action.param.Remainder ?? 0) !== 0
                //Ietra: action.param.Amount - (state.CloseAmount ?? 0) - (state.Remainder ?? 0),
            }        
        default:
            return state
    }
}