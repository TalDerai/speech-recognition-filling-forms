export const workerNA = '/0.jpg'                // worker image if not availible
export const visiblePages = 10                  // max amount of visible paging buttons
export const msgInterval = 3000                 // time to display success and error messages
export const newDesk = {                        // new desk template
    Id: 0,
    Name: '',
    StartBalance: 0,
    StartDate: (new Date()).getTime(),
    Bank: '',
    Branch: '',
    Account: '',
    AccountName: '',
    Comments: ''
} 

export const newWorker = {                        // new desk template
    Id: 0,
    FirstName: '',
    LastName: '',
    Position: '',
    Sn: '',
    Phone: '',
    Mail: '',
    Password: '',
    Image: '',
    Permission: 1,
    Comments: ''
}

export const fPath = process.env.NODE_ENV === "production" ? 'https://files.kupaktana.com' : '/images'