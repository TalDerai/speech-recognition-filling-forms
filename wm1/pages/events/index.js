import absoluteUrl from "next-absolute-url"
import { useState, useEffect, useReducer } from "react"
import { useRouter } from 'next/router'
import { MainLayout } from '../../components/MainLayout'
import { tables } from '../../models/tables'
import { Pager } from '../../components/Pager'
import { TableFilterEvents } from "../../components/TableFilterEvents"
import { initEventState, reducer } from "../../utils/listReducer"
import Link from "next/link"
import TitleRow from "../../components/TitleRow"
import StatusIcon from "../../components/StatusIcon"
import AddEventIcon from "../../components/AddEventIcon"
import { setCookie,parseQuery } from "../../utils/common"
import * as cookie from 'cookie'

export default function Events({ items, amount, desks, workers, selectedDesk, selectedWorker, selectedType, selectedPage, selectedSort, selectedDir, selectedKey, user }) {
  const router = useRouter()
  const [state, dispatch] = useReducer(reducer, { ...initEventState, 
      desk: selectedDesk, worker: selectedWorker, type: selectedType, 
      page: selectedPage, sort: selectedSort, dir:selectedDir, key: selectedKey })
  const [data, setData] = useState({ items, amount })
  const fields = tables['events']
  const [isInit, setInit] = useState(true)
  const [isHovering, setIsHovering] = useState(-1)

  const apply = async () => {
    if (isInit) {
      setInit(false)
    } else {
      const skip = (state.page - 1) * initEventState.size
      const url = `/api/events?limit=${initEventState.size}&skip=${skip}&sort=${state.sort}&dir=${state.dir}&key=${state.key}&type=${state.type}&desk=${state.desk}&worker=${state.worker}`
      setCookie('eventsUrl', url, 1)
      const resp = await fetch(url)
      const json = await resp.json()
      setData(json)
      router.push({ pathname: `/events` }, undefined, { shallow: true })
    }
  }
  useEffect(() => {
    apply()
  }, [state])

  useEffect(() => {
    router.push({ pathname: `/events` }, undefined, { shallow: true })
  }, [])

  return (
    <MainLayout title={'ניהול קופות: אירועים'} active='events' user={user}>
      <TitleRow prop={{
        title: 'אירועים',
        linkLabel: user.Permission > 1 ? ['הפקדה חדשה', 'משיכה חדשה'] : ['', ''],
        linkUrl: user.Permission > 1 ? ['/events/0/?dep=1', '/events/0/?dep=0'] : ['', '']
      }} />
      <TableFilterEvents type={state.type} worker={state.worker} 
        desk={state.desk} sKey={state.key} 
        cbType={((e) => dispatch({ type: 'C-TYPE', param: e }))}
        cbDesk={((e) => dispatch({ type: 'C-DESK', param: e }))}
        cbWorker={((e) => dispatch({ type: 'C-WORKER', param: e }))}
        cbSearch={(e) => dispatch({ type: 'SEARCH', param: e })}
        cbClearSearch={() => dispatch({ type: 'CLEAR_SEARCH' })}
        cbReset={() => dispatch({ type: 'C-RESET' })}
        desks={desks} workers={workers} />

      <table className="table table-striped table-bordered table-sm table-light table-hover">
        <thead>
          <tr>
            {
              fields.map((f, i) => {
                const cls = state.dir === 'ASC' ? 'fa-caret-up' : 'fa-caret-down'
                return <th key={i} className={f.f === 'Status' ? 'td-arc' : ''}>
                  {
                    f.f === 'Status' ? <span>{f.n}</span> :
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
              return <tr key={k} onMouseOver={() => setIsHovering(k)} onMouseOut={() => setIsHovering(-1)}>{fields.map((f, j) => {
                const ltr = (['Amount', 'CloseAmount', 'Remainder'].indexOf(f.f) > -1) ? 'c-ltr' : ''
                if (f.f === 'Description') {
                  return <td key={j * 100}><Link href={'/events/' + row['Id']}><a>{row['Description']}</a></Link></td>
                } else {
                  if (f.f === 'Id')
                    return <td className={`${ltr} ${user.Permission > 1 ? 'w-90' : ''}`} key={j * 100}>
                      {user.Permission > 1 && <AddEventIcon w={row['WorkerId']} d={row['DeskId']} h={isHovering} k={k} />}&nbsp;{row[f.f]}</td>
                  else if (f.f === 'Amount')
                    return <td className={`${ltr} ${row[f.f] > 0 ? 'text-success' : 'text-danger'}`} key={j * 100}>{row[f.f] + row['CloseAmount'] === 0 ? '' : <b>{row[f.f]}</b>}</td>
                  else if (f.f === 'Status')
                    return <td key={j * 100} className="td-arc"><StatusIcon status={row[f.f]} /></td>
                  else
                    return <td className={ltr} key={j * 100}>{row[f.f] == 0 ? '' : row[f.f]}</td>
                }
              })
              }
              </tr>
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
  const { origin } = absoluteUrl(req)
  let { page, size, type, sort, dir, key, worker, desk } = { ...initEventState }

  let url = ''
  const parsedCookies = cookie.parse(req.headers.cookie)
  if (query.prev && parsedCookies['eventsUrl']) {
    url = `${origin}${parsedCookies['eventsUrl']}`
    const qr = parseQuery(url)
    worker = qr['worker']
    desk = qr['desk']
    type = qr['type']
    page = parseInt(qr['skip'])/size + 1
    sort = qr['sort']
    dir=qr['dir']
    key = qr['key']
  } else {    
    if (query && query.worker) worker = query.worker
    if (query && query.desk) desk = query.desk
    const skip = (page - 1) * size
    url = `${origin}/api/events?limit=${size}&skip=${skip}&type=${type}&sort=${sort}&dir=${dir}&key=${key}&worker=${worker}&desk=${desk}`
  }

  const remdata = await fetch(url, {
    headers: {
      secret: process.env.SECRET_COOKIE_PASSWORD,
      userId: user.Id,
      userPermission: user.Permission,
      userDesks: JSON.stringify(userDesks)
    }
  })
  const props = await remdata.json()

  const url1 = `${origin}/api/events/desksAndWorkers`
  const remdata1 = await fetch(url1, {
    method: 'GET',
    headers: {
      secret: process.env.SECRET_COOKIE_PASSWORD,
      userId: user.Id,
      userPermission: user.Permission,
      userDesks: JSON.stringify(userDesks)
    }
  })
  const props1 = await remdata1.json()

  props['workers'] = props1.workers
  props['desks'] = user.Permission === 3 ? props1.desks : props1.desks.filter(d => userDesks.indexOf(d.Id) > -1)
  props['selectedWorker'] = worker
  props['selectedDesk'] = desk
  props['selectedType'] = type
  props['selectedPage'] = page
  props['selectedSort'] = sort
  props['selectedDir'] = dir
  props['selectedKey'] = key
  props['user'] = user

  return { props }
})