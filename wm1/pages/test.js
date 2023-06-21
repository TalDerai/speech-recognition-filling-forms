import { MainLayout } from '../components/MainLayout'
import { useState } from "react"
import MultiSelect from '../components/MultiSelect'
import { desksAndWorkers } from '../utils/data'

export default function Test(props) {
  const [list, setList] = useState([])
  const handleChange = (newList) => {
    setList(newList)
  }

  return (
    <MainLayout title={'ניהול קופות: דף זמני'} active='' user={''}>
      <div className='frm-panel'>
        <MultiSelect items={props.workers} selectedItems={list} callback={handleChange} />        
      </div>
    </MainLayout>
  )
}

import { withSession } from "../utils/session"
export const getServerSideProps = withSession(async function ({ req, res }) {
  const { workers, desks } = await desksAndWorkers()
  return { props: { workers, desks } }
})