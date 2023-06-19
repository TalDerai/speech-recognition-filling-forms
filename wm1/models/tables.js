export const tables = {
    desks:[
        {
            f: 'Id',
            n: 'מס'
        },
        {
            f: 'Name',
            n: 'שם הקופה'
        },        
        {
            f: 'Events',
            n: 'אירועים'
        },
        {
            f: 'Workers',
            n: 'עובדים'
        },
        {
            f: 'Deposit',
            n: 'הפקדות'
        },
        {
            f: 'Withdrawal',
            n: 'משיכות'
        },
        {
            f: 'Remainder',
            n: 'עודפים'
        },
        {
            f: 'Balance',
            n: 'יתרה'
        },
        {
            f: 'Bank',
            n: 'בנק'
        },
        {
            f: 'Branch',
            n: 'סניף'
        },
        {
            f: 'Account',
            n: 'חשבון'
        },
        {
            f: 'Archive',
            n: 'ארכ'
        }
    ],
    workers: [
        {
            f: 'Id',
            n: 'מס'
        },
        {
            f: 'FirstName',
            n: 'שם פרטי'
        },
        {
            f: 'LastName',
            n: 'שם משפחה'
        },
        {
            f: 'Sn',
            n: 'ת"ז'
        },
        {
            f: 'Position',
            n: 'תפקיד'
        },
        {
            f: 'Mail',
            n: 'דואר'
        },
        {
            f: 'Phone',
            n: 'טלפון'
        },
        {
            f: 'Events',
            n: 'אירועים'
        },
        {
            f: 'Desks',
            n: 'קופות'
        },
        {
            f: 'Archive',
            n: 'ארכ'
        }
    ],
    events:[
        {
            f: 'Id',
            n: 'מס'
        },             
        {
            f: 'Description',
            n: 'תיאור'
        },
        {
            f: 'Desk',
            n: 'קופה'
        },  
        {
            f: 'Worker',
            n: 'עובד'
        },
        {
            f: 'Date',
            n: 'תאריך'
        },
        {
            f: 'Amount',
            n: 'סכום'
        },
        {
            f: 'CloseAmount',
            n: 'קניות'
        },        
        {
            f: 'Opened',
            n: 'יתרה'
        },
        {
            f: 'CloseDate',
            n: 'ת.סגירה'
        },
        {
            f: 'Status',
            n: 'מצב'
        }
    ],
    eventsR:[
        {
            f: 'Id',
            n: 'מס'
        },           
        {
            f: 'Tp',
            n: 'פעולה'
        },              
        {
            f: 'Worker',
            n: 'עובד'
        },
        {
            f: 'Date',
            n: 'תאריך'
        }, 
        {
            f: 'Description',
            n: 'תיאור'
        },  
        {
            f: 'Kniot',
            n: 'קניות'
        },    
        {
            f: 'Zhut',
            n: 'זכות'
        },            
        {
            f: 'Flow',
            n: 'יתרה'
        },
        {
            f: 'Opened',
            n: 'סכום פתוח'
        }
    ],
    summary:[
        {
            f:'Id',
            n: 'מס'
        },
        {
            f: 'Name',
            n: 'שם הקופה'
        },  
        {
            f:'StartBalance',
            n: 'יתרת פתיחה'
        },
        {
            f:'Withdrawals',
            n: 'משיכות בתקופה'
        },
        {
            f:'Deposits',
            n: 'הפקדות בתקופה'
        },
        {
            f:'EndBalance',
            n: 'יתרת סגירה'
        },
        {
            f:'OpenedEvents',
            n: 'אירועים פתוחים'
        },
        {
            f:'OpenedSum',
            n: 'סכומים פתוחים'
        }
    ]
}