export const cardModel = {
    desk: {
        Action: '/deskCard',
        Id: {
            type: 'hidden',
            name: 'Id',
            value: ''
        },
        Name: {
            type: 'text',
            name: 'Name',
            title: 'שם הקופה',
            required: true,
            value: '',
            ro: false
        },        
        StartBalance: {
            type: 'number',
            name: 'StartBalance',
            title: 'יתרת פתיחה',
            required: true,
            value: '',
            ro: false
        },
        StartDate: {
            type: 'date',
            name: 'StartDate',
            title: 'תאריך פתיחה',
            required: true,
            value: '',
            ro: false
        },
        Bank: {
            type: 'text',
            name: 'Bank',
            title: 'בנק',
            required: false,
            value: '',
            ro: false
        },
        Branch: {
            type: 'text',
            name: 'Branch',
            title:  'סניף',
            required: false,
            value: '',
            ro: false
        },
        Account: {
            type: 'text',
            name: 'Account',
            title:  'חשבון',
            required: false,
            value: '',
            ro: false
        },
        AccountName: {
            type: 'text',
            name: 'AccountName',
            title:  'שם החשבון',
            required: false,
            value: '',
            ro: false
        },
        Comments: {
            type: 'textarea',
            name: 'Comments',
            title:  'הערות',
            required: false,
            value: '',
            ro: false
        }
    },
    worker: {
        Action: '/workerCard',
        Image: {
            type: 'image',
            value: '',
            fPath: 'https://files.kupaktana.com'
        },
        Id: {
            type: 'hidden',
            name: 'Id',
            value: ''
        },
        FirstName: {
            type: 'text',
            name: 'FirstName',
            title: 'שם פרטי',
            required: true,
            value: '',
            ro: false
        },  
        LastName: {
            type: 'text',
            name: 'LastName',
            title: 'שם משפחה',
            required: true,
            value: '',
            ro: false
        },        
        Sn: {
            type: 'text',
            name: 'Sn',
            title: 'תעודת זהות',
            required: true,
            value: '',
            ro: false
        },
        Permission: {
            type: 'list',
            name: 'Permission',
            title: 'הרשאות',
            required: false,
            value: -1,
            values: [{n:'אורח',v:1},{n:'עובד',v:2},{n:'מנהל',v:3}],
            ro: false
        },
        Position: {
            type: 'text',
            name: 'Position',
            title: 'תפקיד',
            required: false,
            value: '',
            ro: false
        },
        Mail: {
            type: 'text',
            name: 'Mail',
            title:  'דואר אלקטרוני',
            required: false,
            value: '',
            ro: false
        },
        Password: {
            type: 'text',
            name: 'Password',
            title:  'סיסמה',
            required: false,
            value: '',
            ro: false
        },
        Phone: {
            type: 'text',
            name: 'Phone',
            title:  'טלפון',
            required: false,
            value: '',
            ro: false
        },
        Comments: {
            type: 'textarea',
            name: 'Comments',
            title:  'הערות',
            required: false,
            value: '',
            ro: false
        }
    },
    event: {
        Action: '/eventCard',       
        Id: {
            type: 'hidden',
            name: 'Id',
            value: '',
            tab: 0
        },
        EventType: {
            type: 'text',
            name: 'EventType',
            title: 'סוג האירוע', 
            required: false,
            value: -1,            
            ro: true,
            tab: 0
        }, 
        Description: {
            type: 'text',
            name: 'Description',
            title: 'תיאור',
            required: true,
            value: '',
            ro: false,
            tab: 0
        },               
        Amount: {
            type: 'number',
            name: 'Amount',
            title: 'סכום',
            required: true,
            value: '',
            ro: false,
            tab: 0
        },
        Date: {
            type: 'date',
            name: 'Date',
            title: 'תאריך פתיחה',
            required: true,
            value: '',
            ro: false,
            tab: 0
        },
        Reminder: {
            type: 'number',
            name: 'Reminder',
            title: 'עודף',
            required: false,
            value: '',
            ro: false,
            tab: 1
        },
        CloseAmount: {
            type: 'number',
            name: 'CloseAmount',
            title: 'סכום הקנייה',
            required: false,
            value: '',
            ro: false,
            tab: 1
        },
        CloseDate: {
            type: 'date',
            name: 'CloseDate',
            title: 'תאריך סגירה',
            required: false,
            value: '',
            ro: false,
            tab: 1
        },
        Worker: {
            type: 'list',
            name: 'Worker',
            title: 'עובד',
            required: true,
            values:[],
            value: '',
            ro: false,
            tab: 0
        },
        Method: {
            type: 'list',
            name: 'Method',
            title: 'סוג הפקדה',
            required: false,
            values:[{n:'העברה בנקאית',v:1},{n:'צ"ק',v:2},{n:'אחר',v:3}],
            value: '',
            ro: false,
            tab: 0
        },
        Desk: {
            type: 'list',
            name: 'Desk',
            title:  'קופה',
            required: true,
            values:[],
            value: '',
            ro: false,
            tab: 0
        },        
        CloseDescription: {
            type: 'textarea',
            name: 'CloseDescription',
            title:  'הערות סגירה',
            required: false,
            value: '',
            ro: false,
            tab: 1
        }
    }
}