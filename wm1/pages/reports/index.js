import { MainLayout } from '../../components/MainLayout'
import TitleRow from "../../components/TitleRow"
import { desksAndWorkers } from "../../utils/data"
import { useState, useEffect, useReducer } from 'react'
import DatePickerHe from '../../components/DatePickerHe'
import { initState, reducer } from "../../utils/reportReducer"
import VirtualizedSelect from 'react-virtualized-select'
import { rTypes, rCategories, rPeriods, vDesks, vWorkers } from '../../utils/common'

export default function Reports({ workers, desks, user }) {
    const [state, dispatch] = useReducer(reducer, initState)
    const [message, setMessage] = useState({ success: '', error: '' })

    const [counter, setCounter] = useState(-1)

    const myDispatch = ({ type, param }) => {
        dispatch({ type, param })
        dispatch({ type: 'QUERY' })
    }

    const getConter = async () => {
        if (!state.Query.length > 0) return
        const a = await fetch(`/api/report/${state.Query}&count=1`)
        const j = await a.json()
        setCounter(j.counter)
    }

    useEffect(() => {
        getConter()
    }, [state.Query])

    useEffect(() => {
        if (message.success !== '' || message.error !== '') {
            setTimeout(() => {
                setMessage({ success: '', error: '' })
            }, 3000)
        }
    }, [message])

    useEffect(() => {
        if (user.Permission < 3) dispatch({ type: 'WORKER', param: user.Id })
        dispatch({ type: 'QUERY' })
    }, [])

    const handleSubmit = (e) => {
        if (state.Type == 0 && state.DeskId == 0) {
            setMessage({ success: '', error: 'נא לבחור קופה' })
            e.preventDefault()
        }
    }

    return (
        <MainLayout title={'ניהול קופות: דוחות'} active='reports' user={user}>
            <TitleRow prop={{
                title: 'מחולל דוחות',
                linkLabel: '',
                linkUrl: '',
                message: message
            }} />
            <div className="frm-panel min-h-500">
                <form method="post" target='_blank' action={`/reports/report/${state.Query}`} onSubmit={handleSubmit}>
                    <div className="row">
                        <div className="col-md-6 col-lg-4 offset-lg-2 col-sm-6">
                            <label className="form-label">סוג של הדוח</label>
                            <div>
                                <div className="btn-group btn-sm bg-t-4 d-flex" role="group">
                                    {
                                        rTypes.map((rt,i) => {
                                            return <button key={i} className={`btn btn-sm btn-${state.Type != rt.value ? 'outline-' : ''}secondary`}
                                                type="button" onClick={() => myDispatch({ type: 'TYPE', param: rt.value })}>{rt.label}</button>
                                        })
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="col-md-6 col-lg-4 col-sm-6">
                        <label className="form-label">שם הקופה</label>
                            <VirtualizedSelect
                                instanceId={'vDesk'}
                                options={state.Type === 0 ? vDesks(desks) : vDesks(desks, { label: 'כל הקופות', value: 0 })}
                                onChange={(e) => myDispatch({ type: 'DESK', param: e.value })}
                                placeholder='בחר קופה'
                                value={state.DeskId}
                                disabled={state.Type === 1}
                            />
                        </div>
                    </div>

                    <div className="row d-none">
                        <div className="col-lg-4 offset-lg-2 col-md-6 col-sm-6">
                        <label className="form-label">סוג האירוע</label>
                            <VirtualizedSelect
                                instanceId={'vCat'}
                                options={rCategories}
                                onChange={(e) => myDispatch({ type: 'CATEGORY', param: e.value })}
                                value={state.Category}
                            />
                        </div>
                        <div className="col-lg-4 col-md-6 col-sm-6">
                            <label className="form-label">שם העובד</label>
                            <VirtualizedSelect
                                instanceId={'vWorker'}
                                options={vWorkers(workers, { label: 'כל העובדים', value: 0 })}
                                onChange={(e) => myDispatch({ type: 'WORKER', param: e.value })}
                                value={state.WorkerId}
                            />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-md-6 col-lg-4 offset-lg-2 col-sm-6">
                            <label className="form-label">תקופת הדוח</label>
                            <VirtualizedSelect
                                instanceId={'vPeriod'}
                                options={rPeriods}
                                onChange={(e) => myDispatch({ type: 'PERIOD', param: e.value })}
                                value={state.Period}
                            />
                        </div>
                        <div className={`col-md-3 col-lg-2 col-sm-3`}>
                            <label className="form-label">מתאריך</label>
                            <DatePickerHe selectedDate={state.FromDate} archive={state.Period !== 4 ? 1 : 0}
                                cbChange={date => myDispatch({ type: 'FROM', param: date })}
                                disabled={state.Period < 4} />
                        </div>
                        <div className={`col-md-3 col-lg-2 col-sm-3`}>
                            <label className="form-label">עד תאריך</label>
                            <DatePickerHe selectedDate={state.ToDate} archive={state.Period !== 4 ? 1 : 0}
                                cbChange={date => myDispatch({ type: 'TO', param: date })}
                                disabled={state.Period < 4} />
                        </div>
                    </div>

                    <div className="row">
                        <div className="col-lg-8 offset-lg-2 col-sm-12 mt-4 d-flex">
                            <button type="submit" className="btn btn-sm btn-success mr-2 mb-2">יצירת דוח</button>
                            <button type="reset" className="btn btn-sm btn-info mr-2 mb-2">איתחול</button>
                            <div className={counter > -1 ? 'ml-auto mt-2' : 'd-none'}>
                                <span>רשימות בדוח</span>: <b>{counter}</b>
                            </div>
                        </div>

                    </div>
                    <div className='row text-center'>
                        <div className="col-lg-8 offset-lg-2 col-sm-12 mt-4 d-flex">
                            <a target='_blank' href={`/api/report/${state.Query}`}>נתוני דו"ח בפורמט JSON</a>
                        </div>

                    </div>
                </form>
            </div>
        </MainLayout>)
}

import { withSession, redirectToLogin } from "../../utils/session"
export const getServerSideProps = withSession(async function ({ req, res }) {
    const user = req.session.get("user")
    if (!user) return redirectToLogin(res)
    const { workers, desks } = await desksAndWorkers(user)
    return { props: { workers, desks, user } }
})
