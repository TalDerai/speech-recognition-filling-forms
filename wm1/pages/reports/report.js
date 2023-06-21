import absoluteUrl from "next-absolute-url"
import { ReportSummary } from "../../components/ReportSummary"
import { ReportEvents } from "../../components/ReportEvents"
import { PrintLayout } from "../../components/PrintLayout"
import { useEffect,useState } from 'react'
import { useRouter } from 'next/router'
import moment from 'moment'

export default function Report(props) { 
  const router = useRouter()
  
  useEffect(() => {
    router.push({ pathname: `/reports/report` }, undefined, { shallow: true })    
  }, [])

  return <PrintLayout>
    <div className="d-flex">
      <h1>{props.com.Title} {
        props.com.Type == 0 && <><span>:</span><span className='text-danger'>{props.com.Desk}</span></>
      }</h1>
      <div className="ml-auto small pt-4">
        <span>תאריך הפקה: </span><b>{moment().format('DD/MM/YYYY')}</b>
      </div>
    </div>

    <div className="row">
      <div className="col-12 small mb-2">
        <div className="div-headline pt-2">
          {/* <span>עובד</span>: <b>{props.com.Worker}</b>
          <span>סוג</span>: <b>{props.com.Category}</b> */}
          <span>מתאריך</span>: <b>{props.com.From}</b>
          <span>עד תאריך</span>: <b>{props.com.To}</b>
        </div>
      </div>
    </div>
    <div className={props.data.length > 0 ? 'd-none' : 'text-center mt-4 text-danger'}>אין נתונים לפרמטרים המבוקשים</div>
    <section className={props.data.length === 0 ? 'd-none' : ''}>
      {props.com.Type == 0 && <ReportEvents data={props.data} />}
      {props.com.Type == 1 && <ReportSummary data={props.data} />}
    </section> 
  </PrintLayout>
}

import { withSession, redirectToLogin } from "../../utils/session"
export const getServerSideProps = withSession(async function ({ query, req, res }) {
  console.log(req.headers.referer)
  const isLocal = req.headers.referer.indexOf('localhost:7000')>-1 || req.headers.referer.indexOf('mobile.kupaktana.com')>-1
  const user = req.session.get("user")
  if (!user && !isLocal) return redirectToLogin(res)
  const { category, type, worker, desk, from, to } = query
  const { origin } = absoluteUrl(req)
  const url = `${origin}/api/report?desk=${desk}&worker=${worker}&type=${type}&category=${category}&from=${from}&to=${to}`
  console.log(url)
  const d = await fetch(url)
  const data = await d.json()
  return { props: data }
}) 