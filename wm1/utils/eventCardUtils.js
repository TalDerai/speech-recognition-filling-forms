import moment from 'moment'

export const checkFiles = async (id,cbEventFiles) => {
    const res = await fetch(`/api/events/files?id=${id}`)
    const json = await res.json()
    await cbEventFiles(json)
}

export const arcFile = async (id,files,cbEventFiles,cbMessage) => {
    const res = await fetch(`/api/events/arcFile?id=${id}`)
    const json = await res.json()
    cbEventFiles(files.filter(f => f.Id != id))
    if (json.error) {
        cbMessage({ success: '', error: 'שגיאת שמירה' })        
    } else {
        cbMessage({ success: 'פעולה בוצעה בהצלחה', error: '' })
    }
}

export const archive = async (state,dispatch,cbMessage) => {
    const a = state.Archive === 1 ? 0 : 1
    const url = `/api/events/arc?id=${state.Id}&arc=${a}`
    const response = await fetch(url, { method: 'GET' })
    const result = await response.json()
    if (result.error) {
        cbMessage({ success: '', error: 'שגיאת שמירה' })
        console.log(result.error)
    } else {
        dispatch({ type:'ARCHIVE', param: a })
        cbMessage({ success: 'פעולה בוצעה בהצלחה', error: '' })
    }
}

export const updateDeskBalance = async (state,dispatch,cbMessage) => {
    if (!state || !state.DeskId) return
    const url = `/api/desks/balance?id=${state.DeskId}`
    const response = await fetch(url, { method: 'GET' })
    const result = await response.json()
    if (result.error) {
        cbMessage({ success: '', error: 'שגיאת בחישוב יתרה' })
        dispatch({ type:'DESK_BALANCE', param: 0 })
        console.log(result.error)
    } else {
        dispatch({ type:'DESK_BALANCE', param: result.Balance })
    }
}

const isValidData = (e,prop,cbMessage) => {
    console.log(prop.Amount)
    if (e.target.Description.value.trim() == "" || prop.Amount < 0.01 || prop.WorkerId=='' || prop.DeskId=='') {
        cbMessage({ success: '', error: 'יש למלא כל שדות חובה' })
        return false
    }
    if (!prop.isDep) {
        if (prop.CloseAmount > prop.DeskBalance) {
            cbMessage({ success: '', error: 'אין מספיק כסף בקופה' })
            return false
        } else if (parseFloat(prop.Remainder) + parseFloat(prop.CloseAmount) > prop.Amount) {
            console.log(prop.Remainder + prop.CloseAmount, prop.Amount)
            cbMessage({ success: '', error: 'עודף לא יכול ליהות גדול מיתרה אחרי הקנייה' })
            return false
        } else if (prop.CloseAmount > prop.Amount) {
            cbMessage({ success: '', error: 'הקניה לא יכולה ליהות גדולה מסכום המשיכה' })
            return false
        }
    }
    return true
}

export const handleSubmit = async (e,id,state,cbMessage,cbID,myDispatch,cbBackup,router) => {
    e.preventDefault()
    if (!isValidData(e,state,cbMessage)) return    
    const data = {
        Id: id,
        Description: state.Description,
        Desk: state.DeskId,
        Worker: state.WorkerId,
        Method: state.Method,
        //Date: state.Date, //e.target.Date.value,
        Date: e.target.Date.value,
        Comments: state.Comments //e.target.Comments.value
    }
    if (state.isDep) {
        data['Method'] = state.Method
        data['Amount'] = state.Amount // parseFloat(e.target.Amount.value)
    } else {
        data['Amount'] = (-1) * state.Amount //parseFloat(e.target.Amount.value)
        data['Remainder'] = e.target.Remainder.value ?? 0  // state.Remainder ?? 0
        if (id !== 0) {
            data['CloseAmount'] = state.CloseAmount
            data['CloseDate'] = e.target.CloseDate.value, //state.CloseDate
            data['CloseDescription'] = state.CloseDescription
        }
    }

    const url = id === 0 ? '/api/events/create' : '/api/events/update'
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })

    const result = await response.json()
    if (result.error) {
        cbMessage({ success: '', error: 'שגיאת שמירה' })
        console.log(result.error)
    } else {
        if (id == 0) {
            cbID(result.lastID)
            data['Id'] = result.lastID
            router.push({ pathname: `/events/${result.lastID}` }, undefined, { shallow: true })
        }
        /* console.log(result)
        let o = {
            Amount: (state.Amount ?? 0) * (state.isDep ? 1 : (-1)),                                       
            Date: data.Date, //moment(data.Date, 'DD/MM/YYYY').valueOf(),                                              
            CloseDate: data.CloseDate ? moment(result.data, 'DD/MM/YYYY').valueOf() : moment().valueOf()    
        }     
        console.log(o)
        e.preventDefault()
        return 
        */
        myDispatch({
            type: 'SUBMIT',
            param: data
        })        
        //dispatch({type:'UPDATE'})
        cbMessage({ success: 'פעולה בוצעה בהצלחה', error: '' })
    }
    updateDeskBalance(state,myDispatch,cbMessage)
    cbBackup(state)
}

export const getStatus = (st) => {
    if (st.Archive === 1) return 'בארכיון'
    if (st.isDep) return 'פעיל'
    return (st.Amount - (st.CloseAmount ?? 0) - (st.Remainder ?? 0) != 0) ? 'פתוח' : 'סגור'
}
