//import { redirectToEmpty } from "./session"

export const vDesks = (desks, first) => {
    let vd = desks.map((d) => {
        return { label: d.Name, value: parseInt(d.Id) }
    })
    if (first) vd.unshift(first)
    return vd
}

export const vWorkers = (workers, first) => {
    let vd = workers.map((d) => {
        return { label: d.Name, value: parseInt(d.Id) }
    })
    if (first) vd.unshift(first)
    return vd
}

export const vCategories = [
    { label: 'כל האירועים', value: 'all' },
    { label: 'אירועים סגורים', value: 'closed' },
    { label: 'אירועים פתוחים', value: 'opened' },
    { label: 'הפקדות', value: 'deposit' },
    { label: 'משיכות', value: 'withdrawal' },
    { label: 'אירועים בארכיון', value: 'arc' },
]

export const vTypes = (tp) => {
    return [
        //{ label: `כל ה${tp}`, value: "all" },
        { label: `${tp} ${tp === 'קופות' ? 'פעילות' : 'פעילים'}`, value: "all" },
        { label: `${tp} בארכיון`, value: "arc" }
    ]
}
 
export const rTypes = [
    { label: "כרטסת קופה", value: 0 },
    { label: "מאזן תנועות בקופות", value: 1 },
]

export const rCategories = [ // TBC
    { label: 'כל האירועים', value: 0 },
    { label: 'אירועים סגורים', value: 1 },
    { label: 'אירועים פתוחים', value: 2 },
    { label: 'הפקדות', value: 3 },
    { label: 'משיכות', value: 4 },
    { label: 'אירועים בארכיון', value: 5 },
]

export const rPeriods = [   
    { label: 'חודש נוכחי', value: 1 },
    { label: 'רבעון נוכחי', value: 2 },
    { label: 'שנה נוכחית', value: 3 },
    { label: 'תקופה אחרת', value: 4 },
    { label: 'כל התאריכים', value: 0 }
]

export const rowToObject = (ar) => {
    let o = {}
    ar.forEach((a, i) => {
        if (i % 2 === 0) {
            o[a] = ar[i + 1]
        }
    })
    return o
}

export const validUser = (req) => {
    const user = req.session.get("user")
    const intRequest = rowToObject(req.rawHeaders)['secret'] === process.env.SECRET_COOKIE_PASSWORD
    if (user) {
        const userDesks = req.session.get("desks")
        return { Id: user.Id, Permission: user.Permission, Desks: userDesks }
    } else if (intRequest) {
        const o = rowToObject(req.rawHeaders)
        return {
            Id: parseInt(o['userId']),
            Permission: parseInt(o['userPermission']),
            Desks: JSON.parse(o['userDesks'])
        }
    } else {
        return {}
    }
}

export const validUserA = (user) => {
    //const user = req.session.get("user")
    //const intRequest = rowToObject(req.rawHeaders)['secret'] === process.env.SECRET_COOKIE_PASSWORD
    //if (user) {
        //const userDesks = req.session.get("desks")
        return { Id: user.data.Id, Permission: user.data.Permission, Desks: user.desks }
    /* } else if (intRequest) {
        const o = rowToObject(req.rawHeaders)
        return {
            Id: parseInt(o['userId']),
            Permission: parseInt(o['userPermission']),
            Desks: JSON.parse(o['userDesks'])
        }
    } else {
        return {}
    } */
}

export const isNumeric = (n) => {
    return !isNaN(parseFloat(n)) && isFinite(n)
  }

  // cookies management - client side
export const setCookie = (name,value,days) => {
    var expires = ""
    if (days) {
        var date = new Date()
        date.setTime(date.getTime() + (days*24*60*60*1000))
        expires = "; expires=" + date.toUTCString()
    }
    document.cookie = name + "=" + (value || "")  + expires + "; path=/"
}

export const getCookie = (name) => {
    var nameEQ = name + "="
    var ca = document.cookie.split(';')
    for(var i=0;i < ca.length;i++) {
        var c = ca[i]
        while (c.charAt(0)==' ') c = c.substring(1,c.length)
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length)
    }
    return null
}
export const eraseCookie = (name) => {   
    document.cookie = name +'=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
}

export const parseQuery = (queryString) => {
    var query = {}
    var pairs = (queryString[0] === '?' ? queryString.substr(1) : queryString).split('&')
    for (var i = 0; i < pairs.length; i++) {
        var pair = pairs[i].split('=')
        query[decodeURIComponent(pair[0])] = decodeURIComponent(pair[1] || '')
    }
    return query
}