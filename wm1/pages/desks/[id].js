import { useRouter } from 'next/router'
import { MainLayout } from '../../components/MainLayout'
import { useState, useEffect, useReducer } from 'react'
import Link from "next/link"
import moment from 'moment'
import DatePickerHe from '../../components/DatePickerHe'
import { newDesk } from '../../models/common'
import TitlePanel from "../../components/TitlePanel"
import { card } from "./../../utils/data"
import { archive } from '../../utils/deskCardUtils'
import { handleSubmit, getBalanceAndEvents, getWorkers, updateSelectedWorkers } from '../../utils/deskCardUtils'
import { initState, reducer } from "../../utils/deskReducer"
import MultiSelect from '../../components/MultiSelect'
import { desksAndWorkers } from '../../utils/data'
import * as cookie from 'cookie'

export default function Desk(props) {
    const [prop, dispatch] = useReducer(reducer, initState)
    const router = useRouter()
    const [id, setID] = useState(parseInt(router.query.id))
    const [message, setMessage] = useState({ success: '', error: '' })

    const notPermitted = props.user.Permission === 3 ? false : true

    const [list, setList] = useState([])
    const handleChange = (newList) => {
        setList(newList)
        // temp
        //updateSelectedWorkers(id,list.map(l=>l.Id),setMessage)   
    }

    const getList = (ar) => {
        if (id === 0) return
        const newList = props.workers.filter(w => ar.indexOf(w.Id) > -1)
        setList(newList)
    }

    useEffect(() => {
        if (message.success !== '' || message.error !== '') {
            setTimeout(() => {
                setMessage({ success: '', error: '' })
            }, 3000)
        }
    }, [message])

    useEffect(() => {
        const st = id === 0 ? { ...newDesk, 'StartDate': moment().valueOf() }
            : { ...props, 'StartDate': moment(props.StartDate, 'DD/MM/YYYY').valueOf() }
        dispatch({ type: 'INIT', param: st })
        if (id > 0) {
            getBalanceAndEvents(id, dispatch, setMessage)
            getWorkers(id, getList, setMessage)
        }
        //console.log(moment(props.StartDate, 'DD/MM/YYYY').valueOf())
    }, [])

    const submit = (e) => {
        //console.log(prop)
        handleSubmit(e, dispatch, id, setID, setMessage, router)
        if (id > 0) updateSelectedWorkers(id, list.map(l => l.Id))
    }

    return (
        <MainLayout title={'ניהול קופות: פרטי קופה'} active='desks' user={props.user}>
            <TitlePanel prop={{
                id: id,
                newItem: 'יצירת קופה חדשה',
                exItem: ' פרטי קופה מס',
                linkLabel: [props.withFilter ? 'חזור לקופות' : ''],
                linkUrl: [props.withFilter ? '/desks?prev=1' : ''],
                message: message,
                permission: props.user.Permission
            }} />
            <div className="frm-panel">
                <form method="post" onSubmit={submit}>
                    <div className="row">
                        <div className="col-lg-4 offset-lg-2 col-sm-6">
                            <label className="form-label" title="שדה חובה">שם הקופה<span className="text-danger f-req">*</span></label>
                            <input className="form-control form-control-sm" name='Name' defaultValue={prop.Name} disabled={prop.Archive === 1 || notPermitted} />
                            <input type="hidden" name="Id" defaultValue={prop.Id} readOnly />
                        </div>
                        <div className={`col-lg-4 col-sm-6 ${prop.Id === 0 ? ' d-none' : ''}`}>
                            <label className="form-label">סטטוס</label>
                            <span className={"form-control form-control-sm " + (prop.Archive === 1 || notPermitted ? 'text-danger' : 'text-success')}>{prop.Archive === 1 || notPermitted ? 'בארכיון' : 'פעיל'}</span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-2 col-sm-3 offset-lg-2">
                            <label className="form-label" title="שדה חובה">יתרת פתיחה<span className="text-danger f-req">*</span></label>
                            <input className="form-control form-control-sm" name="StartBalance"
                                defaultValue={prop.StartBalance} type="number"
                                disabled={prop.Archive === 1 || notPermitted} />
                        </div>
                        <div className="col-lg-2 col-sm-3">
                            <label className="form-label">תאריך פתיחה</label>
                            <DatePickerHe name="StartDate" selectedDate={prop.StartDate} disabled={prop.Archive === 1 || notPermitted}
                                cbChange={date => dispatch({ type: 'DATE', param: moment(date).valueOf() })} 
                                className="form-control form-control-sm" archive={prop.Archive} />
                        </div>
                        <div className={`col-lg-2 col-sm-3 ${prop.Id === 0 ? ' d-none' : ''}`}>
                            <label className="form-label">יתרה נוכחית</label>
                            <span className="form-control form-control-sm">{prop.DeskBalance ? prop.DeskBalance.toLocaleString('en-US') : 0}</span>
                        </div>
                        <div className={`col-lg-2 col-sm-3 ${prop.Id === 0 ? ' d-none' : ''}`}>
                            <label className="form-label">
                                <Link href={`/events?desk=${prop.Id}`} >
                                    <a>אירועים של הקופה</a>
                                </Link>
                            </label>
                            <span className="form-control form-control-sm">{prop.DeskEvents}</span>
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-4 offset-lg-2 col-sm-6">
                            <label className="form-label">בנק</label>
                            <input className="form-control form-control-sm" name="Bank" defaultValue={prop.Bank} disabled={prop.Archive === 1 || notPermitted} />
                        </div>
                        <div className="col-lg-4 col-sm-6">
                            <label className="form-label">סניף</label>
                            <input className="form-control form-control-sm" name="Branch" defaultValue={prop.Branch} disabled={prop.Archive === 1 || notPermitted} />
                        </div>
                    </div>
                    <div className="row"> 
                        <div className="col-lg-4 offset-lg-2 col-sm-6">
                            <label className="form-label">מספר חשבון</label>
                            <input className="form-control form-control-sm" name="Account" defaultValue={prop.Account} disabled={prop.Archive === 1 || notPermitted} />
                        </div>
                        <div className="col-lg-4 col-sm-6">
                            <label className="form-label">שם החשבון</label>
                            <input className="form-control form-control-sm" name="AccountName" defaultValue={prop.AccountName} disabled={prop.Archive === 1 || notPermitted} />
                        </div>
                    </div>
                    {
                        id > 0 && <div className="row mt-2">
                            <div className="col-lg-8 offset-lg-2 col-sm-12">
                                <MultiSelect items={props.workers} selectedItems={list} callback={handleChange}
                                    title={'עובדים הרשאים לנהל את הקופה'}
                                    disabled={prop.Archive === 1 || notPermitted} />
                            </div>
                        </div>
                    }

                    <div className="row">
                        <div className="col-lg-8 offset-lg-2 col-sm-12">
                            <label className="form-label">פרטים נוספים</label>
                            <input className="form-control form-control-sm" name="Comments" defaultValue={prop.Comments} disabled={prop.Archive === 1 || notPermitted} />
                        </div>
                    </div>

                    <div className={notPermitted ? 'd-none' : 'row'}>
                        <div className="col-lg-8 offset-lg-2 col-sm-12 mt-4 d-flex">
                            <button type="submit" className={`btn btn-sm btn-success mr-2 mb-2 ${prop.Archive === 1 ? ' d-none' : ''}`}>שמירה</button>
                            <button type="reset" className={`btn btn-sm btn-info mr-2 mb-2 ${prop.Archive === 1 ? ' d-none' : ''}`}
                                onClick={() => {
                                    dispatch({ type: 'INIT', param: prop })
                                    getWorkers(id, getList, setMessage)
                                }}>איתחול</button>
                            <div className="ml-auto">
                                <button type="button" className={`btn btn-sm btn-warning ${prop.Id === 0 ? ' d-none' : ''}`}
                                    onClick={() => archive(prop, dispatch, setMessage)}>
                                    {prop.Archive === 1 || notPermitted ? 'להחזיר מארכיון' : 'לשלוח לארכיון'}
                                </button>
                            </div>
                        </div>
                    </div>
                </form>
            </div>
        </MainLayout>
    )
}

import { withSession, redirectToLogin } from "../../utils/session"
export const getServerSideProps = withSession(async function ({ query, req, res }) {
    const user = req.session.get("user")
    if (!user) return redirectToLogin(res)

    const parsedCookies = cookie.parse(req.headers.cookie)
    const withFilter = parsedCookies['desksUrl'] ? true : false

    const { id } = query
    const { workers } = await desksAndWorkers(user)
    //console.log(workers)
    if (id && id > 0) {
        const result = await card('Desk', id)
        return { props: { ...result, user, workers, withFilter } }
    } else {
        return ({ props: { Id: 0, user, workers, withFilter } })
    }
})
