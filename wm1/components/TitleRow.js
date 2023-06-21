import Link from "next/link"
import { useEffect } from 'react'

export default function TitleRow({ prop }) {

    if (!prop.message) {
        prop.message = {success:'',error:''}
    }
   
        useEffect(() => {
            if (prop.message.success !== '' || prop.message.error !== '') {
                setTimeout(() => {
                    prop.message.success = ''
                    prop.message.error = ''
                }, 3000)
            }
        }, [prop.message.success, prop.message.error])    

    return <div className="d-flex">
        <h1>{
            prop.id
                ? (prop.id === 0
                    ? <span>{prop.newItem}</span>
                    : <><span>{prop.exItem}</span><span className={'text-primary'}>{prop.id}</span></>)
                : <span>{prop.title}</span>
        }
        </h1>
        {
            prop && (prop.message.error !== '' || prop.message.success !== '') &&
            <div className="mt-3 mr-2">
                {prop.message.error !== '' ? <div className={"text-danger font-weight-bold pt-1 " + (prop.message.error == '' ? '' : 'd-hidden')}>{prop.message.error}</div> : ''}
                {prop.message.success !== '' ? <div className={"text-success font-weight-bold pt-1 " + (prop.message.success == '' ? '' : 'd-hidden')}>{prop.message.success}</div> : ''}
            </div>
        }
        <div className="ml-auto pt-4">
            {
                Array.isArray(prop.linkLabel) ?
                    <>
                        <Link href={prop.linkUrl[0]}>
                            <a className='e-link'>{prop.linkLabel[0]}</a>
                        </Link>
                        <Link href={prop.linkUrl[1]}>
                            <a>{prop.linkLabel[1]}</a>
                        </Link>
                    </>
                    : <Link href={prop.linkUrl}>
                        <a>{prop.linkLabel}</a>
                    </Link>
            }

        </div>
    </div>
}