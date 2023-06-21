import { useRouter } from 'next/router'
import { MainLayout } from '../../components/MainLayout'
import { useState, useEffect, useReducer } from 'react'
import moment from 'moment'
import DatePickerHe from '../../components/DatePickerHe'
import FileUploader from "../../components/FileUploader"
import QRCode from "../../components/QRCode"
import TitlePanel from "../../components/TitlePanel"
import { card, deskBalance, desksAndWorkers } from "../../utils/data"
import VirtualizedSelect from 'react-virtualized-select'
import { checkFiles, arcFile, archive, updateDeskBalance, handleSubmit } from '../../utils/eventCardUtils'
import { vDesks, vWorkers } from '../../utils/common'
import { fPath } from '../../models/common'
import * as cookie from 'cookie'
import { initState, reducer } from "../../utils/eventReducer"

export default function Desk({ item, desks, workers, user, withFilter }) {
    const [state, dispatch] = useReducer(reducer, initState)
    const router = useRouter()
    const [id, setID] = useState(parseInt(router.query.id))
    const [message, setMessage] = useState({ success: '', error: '' })
    const [backup, setBackup] = useState(null)
    const [files, setEventFiles] = useState([])
    let isFirst = true

    useEffect(() => {
        updateDeskBalance(state, dispatch, setMessage)
    }, [state.DeskId])

    useEffect(() => {
        if (id > 0) {
            checkFiles(id, setEventFiles)
            setInterval(() => checkFiles(id, setEventFiles), 5000)
        }
    }, [id])

    const myDispatch = (a) => {
        if (a.type === 'ADM_CLOSE') {
            dispatch({ type: 'REMAINDER', param: state.Amount - (state.CloseAmount ?? 0) })
            $("#Remainder").val(state.Amount - (state.CloseAmount ?? 0))
            dispatch(a)
            //console.log({param: state.Amount - (state.CloseAmount ?? 0)})
            //console.log(state)
            $('#btnSubmit').trigger('click')        
        } else {
            dispatch(a)
        }
        dispatch({ type: 'UPDATE' })
    }

    useEffect(() => {
        if (isFirst) {           
            myDispatch({
                type: 'INIT', param: item,
            })
            setBackup(item)
            if (!item.Amount) myForm.Amount.value = ''
            console.log(item)
            isFirst = false
        }
        router.push({ pathname: `/events/${item.Id}` }, undefined, { shallow: true })
        
    }, [])

    const submit = async (e) => {        
        handleSubmit(e, id, state, setMessage, setID, myDispatch, setBackup, router)
    }

    return (
        <MainLayout title={'ניהול קופות: פרטי אירוע'} active='events' user={user}>
            <TitlePanel prop={{
                id: id,
                newItem: `${state.isDep ? "הפקדה חדשה" : "משיכה חדשה"}`,
                exItem: ' פרטי אירוע מס',
                linkLabel: [withFilter ? 'חזור לאירועים' : ''],
                linkUrl: [withFilter ? '/events?prev=1' : ''],
                message: message
            }} />

            <form method="post" onSubmit={submit} name='myForm' id='myForm'>
                <div className="section-title">פתיחת אירוע</div>
                <div className="frm-panel-e">
                    <div className="row">
                        <div className="col-md-6 col-lg-4 offset-lg-2 col-sm-6">
                            <label className="form-label">תיאור<span className="text-danger f-req">*</span></label>
                            <input className="form-control form-control-sm" name="Description" defaultValue={state.Description}
                                onChange={(e) => dispatch({ type: 'DESCRIPTION', param: e.target.value })} disabled={state.Disabled} />
                            <input className="form-control form-control-sm" name="isDep" defaultValue={state.isDep} type='hidden' />
                        </div>
                        <div className="col-md-3 col-lg-2 col-sm-3">
                            <label className="form-label">סוג האירוע</label>
                            <span className={`form-control form-control-sm ${state.isDep ? 'text-success' : 'text-danger'}`}>{state.isDep ? 'הפקדה' : 'משיכה'}</span>
                        </div>
                        <div className={`col-md-3 col-lg-2 col-sm-3 ${state.Id === 0 ? ' d-none' : ''}`}>
                            <label className="form-label">סטטוס</label>
                            <span className={`form-control form-control-sm ${state.Disabled ? 'text-secondary' : 'text-primary'})`}>{state.Status}</span>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-4 offset-lg-2 col-md-6 col-sm-6">
                            <label className="form-label">שם הקופה<span className="text-danger f-req">*</span></label>
                            <VirtualizedSelect
                                instanceId={'vDesk'}
                                options={vDesks(desks)}
                                disabled={state.Disabled}
                                onChange={(e) => dispatch({ type: 'DESK', param: e.value })}
                                value={state.DeskId}
                                placeholder={'בחר קופה'}
                            />
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <label className="form-label">שם העובד<span className="text-danger f-req">*</span></label>
                            <VirtualizedSelect
                                instanceId={'vWorker'}
                                options={vWorkers(workers)}
                                disabled={state.Disabled}
                                onChange={(e) => dispatch({ type: 'WORKER', param: e.value })}
                                value={state.WorkerId}
                                placeholder={'בחר עובד'}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-2 offset-lg-2 col-md-3 col-sm-3">
                            <label className="form-label" title="שדה חובה">סכום<span className="text-danger f-req">*</span></label>
                            <input className="form-control form-control-sm" name="Amount" onChange={e => dispatch({ type: 'AMOUNT', param: e.target.value ?? 0 })} 
                                onBlur={e => dispatch({ type: 'AMOUNT', param: e.target.value ?? 0 })}
                                placeholder={'בחר סכום'} defaultValue={state.Amount} type="number" disabled={state.Disabled} min={0.01} step={0.01} />                           
                        </div>
                        <div className="col-lg-2 col-sm-3 col-md-3">
                            <label className="form-label">יתרה בקופה</label>
                            <span className="form-control form-control-sm">{state.DeskBalance ? state.DeskBalance.toLocaleString('en-US') : 0}</span>
                        </div>
                        <div className={`col-lg-4 col-md-6 col-sm-6 ${state.isDep ? '' : ' d-none'}`}>
                            <label className="form-label">סוג הפקדה</label>
                            <div>
                                <div className="btn-group btn-sm bg-t-4 d-flex" role="group">
                                    <button className={`btn btn-sm btn-${state.Method != 1 ? 'outline-' : ''}secondary`}
                                        type="button" disabled={state.Disabled} onClick={() => dispatch({ type: 'METHOD', param: 1 })}>העברה</button>
                                    <button className={`btn btn-sm btn-${state.Method != 2 ? 'outline-' : ''}secondary`}
                                        type="button" disabled={state.Disabled} onClick={() => dispatch({ type: 'METHOD', param: 2 })}>צ'ק</button>
                                    <button className={`btn btn-sm btn-${state.Method != 3 || state.Method == null ? 'outline-' : ''}secondary`}
                                        type="button" disabled={state.Disabled} onClick={() => dispatch({ type: 'METHOD', param: 3 })}>אחר</button>
                                </div>
                            </div>
                        </div>

                    </div>

                    <div className="row">
                        <div className="col-lg-2 col-sm-3 col-md-3 offset-lg-2">
                            <label className="form-label">תאריך</label>
                            <DatePickerHe name="Date" selectedDate={state.Date}
                                cbChange={date => dispatch({ type: 'DATE', param: moment(date).valueOf() })}
                                disabled={state.Disabled} />
                        </div>
                        <div className="col-lg-6 col-md-9">
                            <label className="form-label">פרטים נוספים</label>
                            <input className="form-control form-control-sm" name="Comments" defaultValue={state.Comments} disabled={state.Disabled}
                                onChange={e => dispatch({ type: 'COMMENTS', param: e.target.value })} />
                        </div>
                    </div>
                </div>

                <div className={`section-title ${id === 0 || item.isDep ? ' d-none' : ''}`}>סגירת אירוע</div>
                <div className={`frm-panel-e ${id === 0 || item.isDep ? ' d-none' : ''}`}>
                    <div className="row">
                        <div className="col-lg-2 offset-lg-2 col-md-3 col-sm-3">
                            <label className="form-label">סכום הקניה</label>
                            <input className="form-control form-control-sm" name="CloseAmount"
                                onChange={e => dispatch({ type: 'CLOSE_AMOUNT', param: e.target.value ?? 0 })}
                                onBlur={e => dispatch({ type: 'CLOSE_AMOUNT', param: e.target.value ?? 0 })}
                                defaultValue={state.CloseAmount} type="number" disabled={state.Disabled} min={0} />
                        </div>
                        <div className="col-lg-2 col-sm-3 col-md-3">
                            <label className="form-label">עודף</label>
                            <input className="form-control form-control-sm" name="Remainder" id="Remainder"
                                onChange={e => dispatch({ type: 'REMAINDER', param: e.target.value ?? 0 })}
                                onBlur={e => dispatch({ type: 'REMAINDER', param: e.target.value ?? 0 })}
                                defaultValue={state.Remainder} type="number" disabled={state.Disabled} min={0} />
                        </div>
                        <div className="col-md-3 col-lg-2 col-sm-3">
                            <label className="form-label">יתרה באירוע</label>
                            <span className="form-control form-control-sm">{state.Ietra}</span>
                        </div>
                        <div className="col-lg-2 col-sm-3 col-md-3">
                            <label className="form-label">תאריך סגירה</label>
                            <DatePickerHe name="CloseDate" selectedDate={state.CloseDate} disabled={state.Disabled}
                                cbChange={date => dispatch({ type: 'CLOSE_DATE', param: moment(date).valueOf() })} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-8 offset-lg-2 col-md-12">
                            <label className="form-label">הערות סגירה</label>
                            <input className="form-control form-control-sm" name="CloseDescription" defaultValue={state.CloseDescription}
                                onChange={e => dispatch({ type: 'CLOSE_DESCRIPTION', param: e.target.value })} disabled={state.Disabled} />
                        </div>
                    </div>
                </div>

                <section className={user.Permission > 1 ? '' : 'd-none'}>
                    <div className={`section-title ${id == 0 ? ' d-none' : ''}`}>קבצים</div>
                    <div className="frm-panel-e">
                        <div className={`row pb-3 ${id == 0 ? ' d-none' : ''}`}>
                            <div className={state.Archive == 1 ? "col-lg-8 offset-lg-2 col-md-12" : "col-lg-4 offset-lg-2 col-md-6 col-sm-12"}>
                                <label className="form-label">קבצים</label>
                                <div>
                                    <div>
                                        {
                                            files.length === 0 ? <small className="text-muted">אין קבצים מצורפים</small> :
                                                files.map((f, i) => {
                                                    return <div key={i} className="small text-truncate c-rtl d-flex rem-f">
                                                        <div className={`ml-3 w-20 ${state.Disabled ? 'd-none' : ''}`}>
                                                            <a href='#' onClick={() => arcFile(f.Id, files, setEventFiles, setMessage)}><i className="fa fa-trash" aria-hidden="true"></i></a>
                                                        </div>
                                                        <div>{state.Disabled ? <span>{f.Name}</span> : <a href={`${fPath}${f.Name}`} target="_blank">{f.Name}</a>}</div>
                                                    </div>
                                                })
                                        }
                                    </div>

                                </div>

                            </div>
                            <section className={state.Disabled ? "d-none" : "col-lg-4 col-md-6 col-sm-12"}>
                                <div className='row'>
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <label className="form-label">גרור קובץ או קליק</label>
                                        <FileUploader id={id} tp='event'
                                            onError={er => setMessage({ success: '', error: er })}
                                            onSuccess={() => setMessage({ success: 'קובץ נשלח בהצלחה', error: '' })} />
                                    </div>
                                    <div className="col-lg-6 col-md-6 col-sm-6">
                                        <label className="form-label">שלח דרך ברקוד</label>
                                        <div><QRCode /></div>
                                    </div>
                                </div>
                            </section> 
                        </div> 
                        <div className="row border-top">
                            <div className={`col-lg-8  offset-lg-2 col-md-12 mt-4 ${state.IsOpened ? 'd-none' : 'd-flex'}`}>
                                {user.Permission === 3 && <button type="button" className="btn btn-sm btn-danger mr-2 mb-2"
                                    onClick={() => myDispatch({ type: 'ADM_OPEN' })}>פתיחת אירוע</button>}
                                {user.Permission < 3 && <span className='text-danger'>אירוע סגור, נא לפנות למנהל אם יש צורך לעידכון.</span>}
                            </div>
                            <div className={`col-lg-8  offset-lg-2 col-md-12 mt-4 ${state.IsOpened ? 'd-flex' : 'd-none'}`}>
                                <span className={state.Archive ? 'd-none' : ''}>
                                    <button type="submit" className="btn btn-sm btn-success mr-2 mb-2" id='btnSubmit'>שמירה</button>
                                    <button type="reset" className="btn btn-sm btn-info mr-2 mb-2" onClick={() => myDispatch({type:'RESTORE',param: backup })}>איתחול</button>                                    
                                    <button type="button" className="btn btn-sm btn-danger mr-2 mb-2" data-bs-toggle="modal" data-bs-target="#myModal">סגירת אירוע</button>
                                </span>
                                <div className="ml-auto">
                                    <button type="button" className={`btn btn-sm btn-warning ${state.Id === 0 ? ' d-none' : ''}`}
                                        onClick={() => archive(state, myDispatch, setMessage)}>
                                        {state.Archive ? 'להחזיר מארכיון' : 'לשלוח לארכיון'}
                                    </button>
                                </div>
                            </div>
                        </div>

                    </div>
                </section>
            </form>
            <div
                className="modal modal-alert bg-secondary py-5 c-rtl"
                tabIndex="-1"
                role="dialog"
                id="myModal"
            >
                <div className="modal-dialog modal-dialog-centered" role="document">
                    <div className="modal-content rounded-4 shadow">
                        <div className="modal-header alert-danger"><h4 className='mb-0'>אישור סגירת האירוע</h4></div>
                        <div className="modal-body p-4 c-rtl mh-120">
                            אירוע יהפוך תהפוך ל"קריאה בלבד".
                            נא לוודא שכל הפרטים הינם נכונים.
                        </div>
                        <div className="modal-footer text-left py-1 px-2">
                            <button type="button" className={`btn btn-danger px-4`} onClick={() => myDispatch({ type: 'ADM_CLOSE' })} data-bs-dismiss="modal">
                                כן
                            </button>
                            <button type="button" className={`btn btn-primary px-4`} data-bs-dismiss="modal">
                                לא
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </MainLayout >
    )
}

import { withSession, redirectToLogin } from "../../utils/session"
export const getServerSideProps = withSession(async function ({ query, req, res }) {
    const user = req.session.get("user")
    if (!user) return redirectToLogin(res)

    const parsedCookies = cookie.parse(req.headers.cookie)
    const withFilter = parsedCookies['eventsUrl'] ? true : false
    //console.log('card',parsedCookies['eventsUrl'])

    const { id, dep, sw, sd } = query
    let isDep = dep == 1
    const { workers, desks } = await desksAndWorkers(user)
    let d = {}

    if (id && id > 0) {
        const result = await card('Event', id)
        const dBalance = await deskBalance(result.DeskId)
        const props = {
            item: {
                ...result,
                Amount: (result.Amount ?? 0) * (result.Amount>0 ? 1 : (-1)),
                Date: moment(result.Date, 'DD/MM/YYYY').valueOf(),
                CloseDate: result.CloseDate ? moment(result.CloseDate, 'DD/MM/YYYY').valueOf() : moment().valueOf(),
                isDep: result.Amount > 0,
                DeskBalance: dBalance.error ? 0 : (dBalance.Balance ?? 0),
                Permission: user.Permission,
                DesksAmount: desks.length,
                IsOpened: result.isDep || (result.Amount - (result.CloseAmount ?? 0) - (result.Remainder ?? 0) != 0),
                Disabled: (user.Permission === 1 || desks.length === 0 || result.Archive === 1 ||
                    !(result.isDep || (result.Amount - (result.CloseAmount ?? 0) - (result.Remainder ?? 0) != 0))) ? true : false
            },
            user, workers, desks, withFilter
        }
        d = { props }
    } else {
        const dBalance0 = await deskBalance(desks[0].Id)
        d = {
            props: {
                item: {
                    Id: 0,
                    Description: '',
                    Archive: 0,
                    Method: 1,
                    WorkerId: sw ?? '', //workers[0].Id,
                    DeskId: sd ?? '', //desks[0].Id,
                    Date: moment().valueOf(),
                    CloseDate: moment().valueOf(),
                    Comments: '',
                    isDep: isDep,
                    DeskBalance: dBalance0.error ? 0 : (dBalance0.Balance ?? 0),
                    Permission: user.Permission,
                    DesksAmount: desks.length,
                    IsOpened: true,
                    Disabled: false
                },
                user, workers, desks, withFilter
            }
        }
    }
    return d
})