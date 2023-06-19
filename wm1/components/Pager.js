import { visiblePages as visible } from '../models/common'

export const Pager = ({size, page,amount,callback}) => {

    const count = Math.ceil(amount/size)        
    const start = Math.floor((page - 1) / visible) * visible + 1
    let ar = Array.from({ length: visible}, (_, i) => i + start).filter(a=>a<=count)
    let max = ar[ar.length-1]

    let pagesAmount = Math.floor(amount  / visible)
    if(visible*Math.floor(amount  / visible)!==amount)pagesAmount++

    return <div className="d-flex">
        <ul className={"pagination pagination-sm " + (ar.length==1 ? 'd-none' : '') }>
            {
                start > 1 &&
                <li className="page-item">
                    <a className="page-link" href="#" aria-label="Previous" onClick={()=>callback(-3)}>
                        <span aria-hidden="true">&laquo;</span>
                    </a>
                </li>
            }

            {ar.map((a, i) => {
                return <li className={a === page ? "page-item active" : "page-item"} key={i}><a className="page-link" href="#" onClick={()=>callback(a)}>{a}</a></li>
            })}
            
            {
                max < count &&
                <li className="page-item">
                    <a className="page-link" href="#" aria-label="Next" onClick={()=>callback(-1)}>
                        <span aria-hidden="true">&raquo;</span>
                    </a>
                </li>
            }
        </ul>
        <div className={"ml-auto pg-t " + (amount==0 ? 'd-none' : '')}>
            <span>תוצאות</span><b>{amount}</b>,<span>דף</span><b>{page}</b><span>מ-</span><b>{pagesAmount}</b>
        </div>
        <div className={"pg-t " + (amount!=0 ? 'd-none' : '')}>
            <span className='text-danger'>אין תוצאות</span>
        </div>
    </div>
}