// karteset
import { tables } from '../models/tables'
import { isNumeric } from '../utils/common'

const fields = tables['eventsR']

export const ReportEvents = ({ data }) => {    
    const ltr = (ttl) => {
        return (['Zhut', 'Hova', 'Opened', 'OpenedAc', 'Flow', 'CloseAmount'].indexOf(ttl) > -1) ? 'c-ltr' : ''
    }

    const sum = (events, f, n) => {
        const ar = ["סה'כ פעולות בדוח", "יתרת סגירה", "יתרת סגירה כולל אירועים פתוחים"]
        if (f === 'Opened' && n === 1)
            return events.reduce((s, d) => {
                return s + (d[f] ? parseFloat(d[f]) : 0)
            }, 0)
        else if (f === 'Flow' && n === 2)
            return events[events.length - 1][f]
        else if (f === 'Flow' && n === 3) {
            let opened = events.reduce((s, d) => {
                return s + (d['Opened'] ? parseFloat(d['Opened']) : 0)
            }, 0)
            return events[events.length - 1][f] - opened
        }
        else if ((f === 'Kniot' || f === 'Zhut') && n === 1)
            return events.reduce((s, d) => {
                return s + (d[f] ? parseFloat(d[f]) : 0)
            }, 0)
        else if (f === 'Description')
            return ar[n - 1]
        else
            return ''
    }
    return <table className={"table table-sm table-bordered tb-header"}>
        <thead>
            <tr>
                {
                    fields.map((f, i) => {
                        return <th key={i} className={f.f === 'Description' ? 'w-20p td-arc' : 'td-arc'}>
                            <span>{f.n}</span>
                        </th>
                    })
                }
            </tr>
        </thead>
        <tbody>
            {
                data.map((ev, j) => {
                    return <tr key={j}>
                        {
                            fields.map((f, j) => {
                                return <td key={j * 100} className={`${ltr(f.f)} ${f.f == 'Zhut' ? 'text-success' : (f.f == 'Knia' || f.f == 'Opened' ? 'text-danger' : '')}`}>
                                    {ev[f.f] ? ( f.f!='Id' ? ev[f.f].toLocaleString('en-US') : ev[f.f]) : ''}
                                </td>
                            })
                        }
                    </tr>
                })
            }
        </tbody>
        <tfoot>
            <tr>
                {
                    fields.map((f, j) => {
                        return <th key={j}><span className={ltr(f.f)}>{sum(data, f.f, 1).toLocaleString('en-US')}</span> <span>{isNumeric(sum(data, f.f, 1)) ? 'ש"ח' : ''}</span></th>
                    })
                }
            </tr>
            <tr>
                {
                    fields.map((f, j) => {
                        return <th key={j}><span className={ltr(f.f)}>{sum(data, f.f, 2).toLocaleString('en-US')}</span> <span>{isNumeric(sum(data, f.f, 2)) ? 'ש"ח' : ''}</span></th>
                    })
                }
            </tr>
            <tr>
                {
                    fields.map((f, j) => {
                        return <th key={j}><span className={ltr(f.f) + ' d-inline-block'}>{sum(data, f.f, 3).toLocaleString('en-US')}</span> <span>{isNumeric(sum(data, f.f, 3)) ? 'ש"ח' : ''}</span></th>
                    })
                }
            </tr>
        </tfoot>
    </table>
}