import { useState, useEffect } from "react"

export default function MultiSelect({ items, selectedItems, callback, title, disabled }) {
    const [selected, setSelected] = useState([])

    useEffect(()=>{
        //console.log(selectedItems)
        setSelected(selectedItems)
    },[selectedItems])

    const getItem = (i) => {
        let list = [...selected]
        if (list.findIndex(x => x.Id == i) > -1)
            list = list.filter(x => x.Id != i)
        else
            list.push(items.find(x => x.Id == i))
        setSelected(list)
        callback(list)
    }
    return (
        <>
            <div className='d-flex row mr-0 ml-0'>
                <label className="form-label">{title}</label>
                <div className={`ml-auto small ${disabled ? 'd-none' : ''}`}>
                    <a href='#' data-bs-toggle="modal" data-bs-target="#myModal">ניהול הרשאות</a>
                </div>
            </div>

            <div className={`form-control-sp row pt-1 mr-0 ml-0`}>{
                !selected || selected.length === 0 ? <span className="mx-2 small mb-1 mt-0">אין הרשאות</span> :
                    selected.map((a, i) => {
                        return <div className='btn btn-sm btn-secondary multi-item mb-1 ml-1' key={i}>{a.Name}</div>
                    })
            }
            </div>

            <div
                className="modal modal-alert bg-secondary py-5 c-rtl"
                tabIndex="-1"
                role="dialog"
                id="myModal"
            >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content rounded-4 shadow">
                        <div className="modal-header alert-primary"><h4 className='mb-0'>בחר מהרשימה</h4></div>
                        <div className="modal-body p-4 c-rtl mh-120">
                            {
                                items.map((a, i) => {
                                    return <div className={`btn btn-sm btn${selected.findIndex(x => x.Id == a.Id) > -1 ? '' : '-outline'}-secondary multi-item mt-1 mb-0 ml-1 mr-0`} key={i}
                                        onClick={() => getItem(a.Id)}>{a.Name}</div>
                                })
                            }
                            <div className="multi-item-end"></div>
                        </div>
                        <div className="modal-footer text-left py-1 px-2">
                            <button type="button" className={`btn btn-primary ml-auto`} data-bs-dismiss="modal">
                                סגור
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}