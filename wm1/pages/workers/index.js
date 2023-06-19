import absoluteUrl from "next-absolute-url"
import { useState, useEffect, useReducer, useRef, useContext } from "react"
import { MainLayout } from '../../components/MainLayout'
import { tables } from '../../models/tables'
import { workerNA, fPath } from '../../models/common'
import { Pager } from '../../components/Pager'
import { TableFilter } from "../../components/TableFilter"
import { initState, reducer } from "../../utils/listReducer"
import Link from "next/link"
import TitleRow from "../../components/TitleRow"
import { setCookie, parseQuery } from "../../utils/common"
import * as cookie from 'cookie'

export default function Workers({ items, amount, user,selectedArc,selectedKey,selectedDir,selectedSort }) {

    const [state, dispatch] = useReducer(reducer, {...initState, arc: selectedArc,key: selectedKey, dir: selectedDir, sort:selectedSort })
    const [data, setData] = useState({ items, amount })
    const fields = tables['workers']
    const [isInit, setInit] = useState(true)
    const icons = ['א', 'ע', 'מ']
    const tooltips = ['אורח', 'עובד', 'מנהל']
    const badges = ['secondary', 'info', 'danger']

    const apply = async () => {
        if (isInit) {
            setInit(false)
        } else {
            const skip = (state.page - 1) * initState.size
            const url = `/api/workers?limit=${initState.size}&skip=${skip}&arc=${state.arc}&sort=${state.sort}&dir=${state.dir}&key=${state.key}`
            setCookie('workersUrl', url, 1)
            const resp = await fetch(url)
            const json = await resp.json()
            setData(json)
        }
    }

    useEffect(() => {
        apply()
    }, [state])

    return (
        <MainLayout title={'ניהול קופות: עובדים'} active='workers' user={user}>
            <TitleRow prop={{
                title: 'עובדים',
                linkLabel: user.Permission > 1 ? 'עובד חדש' : '',
                linkUrl: user.Permission > 1 ? '/workers/0' : ''
            }} />
            <TableFilter tp={'עובדים'} arc={state.arc} sKey={state.key}
                cbArc={((e) => dispatch({ type: 'ARC', param: e }))}
                cbSearch={(e) => dispatch({ type: 'SEARCH', param: e })}
                cbClearSearch={() => dispatch({ type: 'CLEAR_SEARCH' })}
                cbReset={() => dispatch({ type: 'C-RESET' })} />

            <table className="table table-striped table-bordered table-sm table-light table-hover">
                <thead>
                    <tr>
                        {
                            fields.map((f, i) => {
                                const cls = state.dir === 'ASC' ? 'fa-caret-up' : 'fa-caret-down'
                                return <th key={i} className={f.f === 'Archive' ? 'td-arc' : ''}>
                                    {
                                        f.f === 'Archive' ? <span>{f.n}</span> :
                                            <a href="#" onClick={() => dispatch({ type: 'SORT', param: f.f })}>
                                                {f.n} {f.f === state.sort ? <span className={'fa ' + cls}></span> : ''}
                                            </a>
                                    }
                                </th>
                            })
                        }
                    </tr>
                </thead>
                <tbody>
                    {
                        data.items.map((row, k) => {
                            return <tr key={k}>{fields.map((f, j) => {
                                if (j === 1) {
                                    let im = row['Image'] && row['Image'].length > 0 ? <img src={fPath + row['Image']} className='thumb' /> :
                                        <img src={fPath + workerNA} className='thumb' />
                                    return <td key={j * 100} colSpan='2'>
                                        <Link href={`/workers/${row['Id']}`}>
                                            <a><div className="d-im">{im}</div> {row['FirstName'] + ' ' + row['LastName']}</a>
                                        </Link></td>
                                } else if (f.f === 'Id') {
                                    let k = row['Permission'] - 1
                                    return <td key={j * 100}>{<span className={`user-level badge badge-${badges[k]}`} title={tooltips[k]}>{icons[k]}</span>} {row[f.f]}</td>
                                } else if (f.f === 'Mail') {
                                    return <td key={j * 100}><a href={'mailto:' + row[f.f]}>{row[f.f]}</a></td>
                                } else if (f.f === 'Archive') {
                                    return <td key={j * 100} className="td-arc">{row[f.f] === 1 && <i className="fa fa-archive"></i>}</td>
                                } else if (j !== 2) {
                                    return <td key={j * 100}>{row[f.f]}</td>
                                }
                            })
                            }</tr>
                        })
                    }
                </tbody>
            </table>
            <Pager size={state.size} page={state.page} amount={data.amount} callback={(p) => dispatch({ type: 'PAGE', param: p })}></Pager>

        </MainLayout>)
}

import { withSession, redirectToLogin } from "../../utils/session"
export const getServerSideProps = withSession(async function ({ query, req, res }) {
    const user = req.session.get("user")
    if (!user) return redirectToLogin(res)
    const userDesks = req.session.get("desks")
    let { page, size, arc, sort, dir, key } = { ...initState }
    const { origin } = absoluteUrl(req)

    let url = ''
    const parsedCookies = cookie.parse(req.headers.cookie)
    if (query.prev && parsedCookies['workersUrl']) {
        url = `${origin}${parsedCookies['workersUrl']}`
        const qr = parseQuery(url)
        arc = qr['arc']
        key = qr['key']
        page = parseInt(qr['skip']) / size + 1
        sort = qr['sort']
        dir = qr['dir']
    } else {
        const skip = (page - 1) * size
        url = `${origin}/api/workers?limit=${size}&skip=${skip}&arc=${arc}&sort=${sort}&dir=${dir}&key=${key}`
    }

    const remdata = await fetch(url, {
        method: 'GET',
        headers: {
            secret: process.env.SECRET_COOKIE_PASSWORD,
            userId: user.Id,
            userPermission: user.Permission,
            userDesks: JSON.stringify(userDesks)
        }
    })
    const props = await remdata.json()
    props['user'] = user
    props['selectedArc'] = arc
    props['selectedKey'] = key
    props['selectedSort'] = sort
    props['selectedDir'] = dir
    return { props }
})