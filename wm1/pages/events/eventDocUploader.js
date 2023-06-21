import { useState, useEffect, useReducer } from 'react'
import FileUploader from "../../components/FileUploader"

export default function eventDocUploader(prop) {
const [message,setMessage] = useState({tp:'',text:''})

    return <div className="container-fluid">
        <div className='text-center'>
            <label className="form-label">גרור קובץ או קליק</label>
            <FileUploader id={prop.Id} tp='event' onError={(e) => setMessage({ tp: 'danger', text: e })} 
                onSuccess={(e)=>setMessage({ tp: 'success', text: e })}/>{/* 'שגיאת שמירה' */}
            <div className={`text-${message.tp} font-weight-bold pt-1 ${message.text === '' ? 'd-hidden' : ''}`}>{message.text}</div>            
        </div>
    </div>
}

export async function getServerSideProps({ query }) {
    return { props: { Id: query.ev ?? 0 } }
}