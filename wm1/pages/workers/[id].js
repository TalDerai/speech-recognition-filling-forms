import { useRouter } from 'next/router'
import { MainLayout } from '../../components/MainLayout'
import { useState, useEffect } from 'react'
import Link from "next/link"
import { newWorker } from '../../models/common'
import ImageUploader from "../../components/ImageUploader"
import TitlePanel from "../../components/TitlePanel"
import { card } from "../../utils/data"
import { handleSubmit, archive, getDesks,updateSelectedWorkers } from "../../utils/workerCardUtils"
import MultiSelect from '../../components/MultiSelect'
import { desksAndWorkers } from '../../utils/data'
//import { setCookie } from "../../utils/common"
import * as cookie from 'cookie'

export default function Desk(props) {
    const router = useRouter()
    const [id, setID] = useState(parseInt(router.query.id))
    const [prop, setProp] = useState({ ...props })
    const [message, setMessage] = useState({ success: '', error: '' })

    const [permission, setPermission] = useState(prop.Permission)
    const [savedPermission, setSavedPermission] = useState(prop.Permission)

    const notPermitted = props.user.Permission === 3 ? false : true

    const [list, setList] = useState([])
    const handleChange = (newList) => {
        setList(newList) 
    }

    const getList = (ar) =>{
        if(id===0)return
        const newList = props.desks.filter(d=>ar.indexOf(d.Id)>-1)
        setList(newList)
    }

    useEffect(() => {
        if (id === 0) 
            setProp({ ...newWorker })
        else
            getDesks(id, getList, setMessage)        
    }, [])

    useEffect(() => {
        if (message.success !== '' || message.error !== '') {
            setTimeout(() => {
                setMessage({ success: '', error: '' })
            }, 3000)
        }
    }, [message])

    const submit = (e) => {
        handleSubmit(e, permission, setSavedPermission, id, setID, setProp, setMessage, router)
        if(id>0)updateSelectedWorkers(id,list.map(l=>l.Id)) 
    }

    return (
        <MainLayout title={'ניהול קופות: פרטי קופה'} active='workers' user={props.user}>
            <TitlePanel prop={{
                id: id,
                newItem: 'יצירת עובד חדש',
                exItem: ' פרטי עובד מס', 
                linkLabel: [props.withFilter ? 'חזור לעובדים' : ''],
                linkUrl: [props.withFilter ? '/workers?prev=1' : ''],
                message: message, 
                permission: props.user.Permission
            }} />
            <div className="frm-panel">
                <form method="post" onSubmit={submit}>
                    <div className="row">
                        <div className={`col-md-4 col-lg-2 offset-lg-1 ${prop.Id === 0 ? 'd-none' : ''}`}>
                            <div>
                                <ImageUploader imLabel={"החלף תמונה"} tp="worker" id={prop.Id} img={prop.Image}  
                                    disabled={prop.Archive===1 || notPermitted}
                                    onError={er => setMessage({ success: '', error: er })}
                                    onSuccess={() => setMessage({ success: 'תמונה הוכלפה בהצלחה', error: '' })} />
                            </div>
                        </div>
                        <div className={`col-lg-8 col-sm-12 ${prop.Id === 0 ? 'offset-lg-2' : ''}`}>
                            <div className="row">
                                <div className="col-sm-6">
                                    <label className="form-label" title="שדה חובה">שם פרטי<span className="text-danger f-req">*</span></label>
                                    <input className="form-control form-control-sm" name='FirstName' defaultValue={prop.FirstName} disabled={prop.Archive === 1 || notPermitted} />
                                    <input type="hidden" name="Id" value={prop.Id} readOnly />
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label">סטטוס</label>
                                    <span className={"form-control form-control-sm " + (prop.Archive === 1 || notPermitted ? 'text-danger' : 'text-success')}>{prop.Archive === 1 || notPermitted ? 'בארכיון' : 'פעיל'}</span>
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <label className="form-label" title="שדה חובה">שם משפחה<span className="text-danger f-req">*</span></label>
                                    <input className="form-control form-control-sm" name='LastName' defaultValue={prop.LastName} disabled={prop.Archive === 1 || notPermitted} />
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label">תפקיד</label>
                                    <input className="form-control form-control-sm" name='Position' defaultValue={prop.Position} disabled={prop.Archive === 1 || notPermitted} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <label className="form-label">דואר אלקטרוני</label>
                                    <input className="form-control form-control-sm" name='Mail' defaultValue={prop.Mail} disabled={prop.Archive === 1 || notPermitted} />
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label">סיסמא</label>
                                    <input className="form-control form-control-sm" name='Password' defaultValue={prop.Password} disabled={prop.Archive === 1 || notPermitted} />
                                </div>
                            </div>
                            <div className="row">
                                <div className="col-sm-6">
                                    <label className="form-label">טלפון</label>
                                    <input className="form-control form-control-sm" name='Phone' defaultValue={prop.Phone} disabled={prop.Archive === 1 || notPermitted} />
                                </div>
                                <div className="col-sm-6">
                                    <label className="form-label">תעודת זהות</label>
                                    <input className="form-control form-control-sm" name='Sn' defaultValue={prop.Sn} disabled={prop.Archive === 1 || notPermitted} />
                                </div>
                            </div>
                            {
                                id >0 && <div className="row">
                                <div className="col-sm-6">
                                    <label className="form-label">הרשאות</label>
                                    <div>
                                        <div className="btn-group btn-sm bg-t-4 d-flex" role="group">
                                            <button className={`btn btn-sm btn-${permission != 3 ? 'outline-' : ''}secondary`}
                                                type="button" disabled={prop.Archive === 1 || notPermitted} onClick={() => setPermission(3)}>מנהל</button>
                                            <button className={`btn btn-sm btn-${permission != 2 ? 'outline-' : ''}secondary`}
                                                type="button" disabled={prop.Archive === 1 || notPermitted} onClick={() => setPermission(2)}>עובד</button>
                                            <button className={`btn btn-sm btn-${permission == 3 || permission == 2 ? 'outline-' : ''}secondary`}
                                                type="button" disabled={prop.Archive === 1 || notPermitted} onClick={() => setPermission(1)}>אורח</button>
                                        </div>
                                    </div>
                                </div>
                                <div className='col-sm-6'>
                                    <label className="form-label">
                                        {
                                            prop.Archive === 1 || notPermitted ?
                                                <span>אירועים של העובד</span> :
                                                <Link href={`/events?worker=${prop.Id}`} disabled={prop.Archive === 1 || notPermitted}>
                                                    <a>אירועים של העובד</a>
                                                </Link>
                                        }
                                    </label>
                                    <span className="form-control form-control-sm">{prop.Events}</span>
                                </div>
                            </div>
                            }
                            {
                                id>0 && <div className="row mt-2">
                                <div className="col-sm-12">
                                    <MultiSelect items={props.desks} selectedItems={list} 
                                    callback={handleChange} title='קופות שהעובד רשאי לנהל'
                                    disabled={prop.Archive === 1 || notPermitted} />
                                </div>
                            </div>
                            }                            
                            <div className="row">
                                <div className="col-sm-12">
                                    <label className="form-label">הערות</label>
                                    <input className="form-control form-control-sm" name="Comments" defaultValue={prop.Comments} disabled={prop.Archive === 1 || notPermitted} />
                                </div>
                            </div>
                            <div className={ notPermitted ? 'd-none' : 'row'}>
                                <div className="col-sm-12 mt-4 d-flex">
                                    <button type="submit" className={`btn btn-sm btn-success mr-2 mb-2 ${prop.Archive === 1 ? ' d-none' : ''}`}>שמירה</button>
                                    <button type="reset" className={`btn btn-sm btn-info mr-2 mb-2 ${prop.Archive === 1 ? ' d-none' : ''}`} 
                                        onClick={() => {
                                            setPermission(savedPermission)
                                            getDesks(id, getList, setMessage)
                                        }}>איתחול</button>
                                    <div className="ml-auto">
                                        <button type="button" className={`btn btn-sm btn-warning ${prop.Id === 0 ? ' d-none' : ''}`} onClick={() => archive(prop, setProp, setMessage)}>
                                            {prop.Archive === 1 || notPermitted ? 'להחזיר מארכיון' : 'לשלוח לארכיון'}
                                        </button>
                                    </div>
                                </div>
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
    const withFilter = parsedCookies['workersUrl'] ? true : false

    const { id } = query
    const { desks } = await desksAndWorkers(user)
    if (id && id > 0) {
        const result = await card('Worker', id)        
        if (user.Permission < 3) result.Password = '*****'        
        return { props: { ...result, user, desks, withFilter } }        
    } else {
        return ({ props: { Id: 0, user, desks, withFilter } })
    }
})