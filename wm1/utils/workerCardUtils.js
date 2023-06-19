export const archive = async (prop, setProp, setMessage) => {
    const a = prop.Archive === 1 ? 0 : 1
    const url = `/api/workers/arc?id=${prop.Id}&arc=${a}`
    const response = await fetch(url, { method: 'GET' })
    const result = await response.json()
    if (result.error) {
        setMessage({ success: '', error: 'שגיאת שמירה' })
        console.log(result.error)
    } else {
        setProp({ ...prop, 'Archive': a })
        setMessage({ success: 'פעולה בוצעה בהצלחה', error: '' })
    }
}

const isValidData = (e) => {
    if (e.target.FirstName.value.trim() == "" || e.target.LastName.value.trim() == "") {
        return false
    } else {
        return true
    }
}

const mailExists = async (mail) => {
    const url = `/api/workers/mailExists?mail=${mail}`
    const response = await fetch(url, { method: 'GET' })
    const result = await response.json()
    return result
}

export const handleSubmit = async (e, permission, setSavedPermission, id, setID, setProp, setMessage, router) => {
    e.preventDefault()
    if (!isValidData(e)) {
        setMessage({ success: '', error: 'יש למלא כל שדות חובה' })
        return
    } else {
        setSavedPermission(permission)
        const existingMail = await mailExists(e.target.Mail.value)
        if (id == 0 && existingMail) {
            setMessage({ success: '', error: 'דואר אלקטרוני כבר רשום במערכת' })
            return
        } else {
            const data = {
                Id: id,
                FirstName: e.target.FirstName.value,
                LastName: e.target.LastName.value,
                Position: e.target.Position.value,
                Password: e.target.Password.value,
                Sn: e.target.Sn.value,
                Phone: e.target.Phone.value,
                Mail: e.target.Mail.value,
                Permission: permission,
                Comments: e.target.Comments.value
            }

            const url = id == 0 ? '/api/workers/create' : '/api/workers/update'
            if (id === 0) data['Archive'] = 0
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            })

            const result = await response.json()
            if (result.error) {
                setMessage({ success: '', error: 'שגיאת שמירה' })
                console.log(result.error)
            } else {
                if (id == 0) {
                    router.push({ pathname: `/workers/${result.lastID}` }, undefined, { shallow: true })
                    setID(result.lastID)
                    data['Id'] = result.lastID
                    setProp({ ...data })
                }
                //setSavedPermission(result.Permission)
                setMessage({ success: 'פעולה בוצעה בהצלחה', error: '' })
            }
        }
    }
}

export const getDesks = async (id,cbList,cbMessage)=>{
    const url = `/api/workers/desks?id=${id}`
    const response = await fetch(url, { method: 'GET' })
    const result = await response.json()
    if (result.error) {
        cbMessage({ success: '', error: 'שגיאת שרת - קופות לפי עובד' })
        cbList([])
        console.log(result.error)
    } else {     
        cbList(result)      
    }
}

export const updateSelectedWorkers = async (id,list) => {
    const data = {
        tp: 'worker',
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