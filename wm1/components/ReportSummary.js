// maazan
import { tables } from '../models/tables'
const fields = tables['summary']

export const ReportSummary = ({ data }) => {
    const sum = (f)=>{
        if(f==='Id')
            return ''
        else if(f==='Name')
            return 'סה"כ'
        else{
            const res = data.reduce((s,d)=>{
                return s +  (d ? parseFloat(d[f]) : 0)
            },0)
            return res
        }
    }

    return <div className='rtl'>
       <table className="table table-sm table-bordered tb-header">
            <thead>
                <tr>
                    {
                        fields.map((f, i) => {
                            return <th key={i} className={'td-arc'}>
                                <span>{f.n}</span>
                            </th>
                        })
                    }
                </tr>
            </thead>
           <tbody>
                {
                    data.map((row,k)=>{       
                        return <tr key={k}> 
                            {
                                fields.map((f, j) => {
                                    return f.f==='Id' || f.f === 'Name' 
                                        ? <td key={j}>{row[f.f] ?? ''}</td>
                                        : <td key={j}>{row[f.f] ? row[f.f].toLocaleString('en-US') : ''}</td>
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
                            return <th key={j}>{sum(f.f).toLocaleString('en-US')}</th>
                        })
                    }
                </tr>
            </tfoot> 
        </table> 
    </div>
}