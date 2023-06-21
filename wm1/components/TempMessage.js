import { useEffect } from 'react'
import {msgInterval} from '../models/common'

export default function TempMessage({text,isError,callback}){    
    useEffect(()=>{
        if(text!==''){
            setTimeout(() => {
                callback()          
            }, msgInterval)
        }
    },[text])
    return isError 
        ? <div className={"text-danger font-weight-bold pt-1 " + (text == '' ? '' : 'd-hidden')}>{text}</div>
        : <div className={"text-success font-weight-bold pt-1 " + (text == '' ? '' : 'd-hidden')}>{text}</div>
}