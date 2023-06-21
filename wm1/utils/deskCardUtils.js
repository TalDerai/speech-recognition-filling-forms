export const archive = async (prop, dispatch, cbMessage) => {
    const a = prop.Archive === 1 ? 0 : 1
    const url = `/api/desks/arc?id=${prop.Id}&arc=${a}`
    const response = await fetch(url, { method: 'GET' })
    const result = await response.json()
    if (result.error) {
        cbMessage({ success: '', error: 'שגיאת שמירה' })
        console.log(result.error)
    } else {
        dispatch({type:'ARCHIVE',param: a})
        cbMessage({ success: 'פעולה בוצעה בהצלחה', error: '' })
    }
}

const isValidData = (e, cbMessage) => {
    if (e.target.Name.value.trim() == "" || e.target.StartBalance.value == 0) {
        cbMessage({ success: '', error: 'יש למלא כל שדות חובה' })
        return false
    }
    return true
}

const updateEvents = async (i, dispatch, cbMessage) => {
    const url = `/api/desks/events?id=${i}`
    const response = await fetch(url, { method: 'GET' })
    const result = await response.json()
    if (result.error) {
        cbMessage({ success: '', error: 'שגיאת שרת - כמות האירועים' })
        dispatch({ type: 'DESKEVENTS', param: 0 })
        console.log(result.error)
    } else {
        dispatch({ type: 'DESKEVENTS', param: result.Events })
    }
}

const updateBalance = async (i, dispatch, cbMessage) => { 
    const url = `/api/desks/balance?id=${i}`
    const response = await fetch(url, { method: 'GET' })
    const result = await response.json()
    if (result.error) {
        cbMessage({ success: '', error: 'שגיאת שרת - כמות האירועים' })
        dispatch({ type: 'DESKBALANCE', param: 0 })
    } else {           
        dispatch({ type: 'DESKBALANCE', param: result.Balance })
    }
}

export const getBalanceAndEvents = async (id, dispatch, cbMessage) => {
    await updateBalance(id, dispatch, cbMessage)
    await updateEvents(id, dispatch, cbMessage)
}

export const handleSubmit = async (e, dispatch, id, cbID, cbMessage,router) => {
    e.preventDefault()
    if (!isValidData(e)) return
    const data = { 
        Id: id,
        Name: e.target.Name.value,
        StartBalance: e.target.StartBalance.value,
        StartDate: e.target.StartDate.value,
        Bank: e.target.Bank.value,
        Branch: e.target.Branch.value,
        Account: e.target.Account.value,
        AccountName: e.target.AccountName.value,
        Comments: e.target.Comments.value
    }
    const url = id == 0 ? '/api/desks/create' : '/api/desks/update'
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
            router.push({ pathname: `/desks/${result.lastID}` }, undefined, { shallow: true })
        } else {
            await getBalanceAndEvents(id, dispatch, cbMessage)
        }
        dispatch({type:'UPDATE',param: data})
        cbMessage({ success: 'פעולה בוצעה בהצלחה', error: '' })
    }
}

export const getWorkers = async (id,cbList,cbMessage)=>{
    const url = `/api/desks/workers?id=${id}`
    const response = await fetch(url, { method: 'GET' })
    const result = await response.json()
    if (result.error) {
        cbMessage({ success: '', error: 'שגיאת שרת - עובדים לפי קופה' })
        cbList([])
        console.log(result.error)
    } else {     
        cbList(result)      
    }
}

export const updateSelectedWorkers = async (id,list) => {
    const data = {
        tp: 'desk',
        id,
        list
    }
    const url = `/api/deskWorkers`
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data)
    })
    const result = await response.json()
    //console.log(result)
}
