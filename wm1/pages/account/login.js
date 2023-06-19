import { useState,useEffect } from 'react'
import { useRouter } from 'next/router'

export default function Login(props) {
    const router = useRouter()
    const [error, setError] = useState('')
    const [loggedin, setLoggedin] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()      
        if(e.target.mail.value.trim()==='') {
            setError('דואר אלקטרוני הינו שדה חובה')
            return
        }else if(e.target.password.value.trim()==='') {
            setError('סיסמא הינו שדה חובה')
            return
        }

        const data = {
            mail: e.target.mail.value,
            password: e.target.password.value
        }
        const url = '/api/account/login'
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        })
        const result = await response.json()
        if (!result.error) {            
            setLoggedin(true)            
        } else {
            setError(result.error)
        }
    }

    useEffect(() => {
        if(loggedin){
            router.push("../")
        }
      },[loggedin])

    return (

        <div className="container pt-5">
            <form method="post" onSubmit={handleSubmit}>
            <div className="row">
            <div className="col-lg-6 offset-lg-3 col-md-12">
                <div className="frm-panel row">
                    <div className='col-lg-12'>
                    <div className="row">
                        <div className="col-lg-12">
                            <h3>מערכת TUSHI קופות</h3>
                            <hr />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-6 col-md-12">
                            <label className="form-label">דואר אלקטרוני<span className="text-danger f-req">*</span></label>
                            <input className="form-control form-control-sm" name="mail" defaultValue={''} />
                        </div>
                        <div className="col-lg-6 col-md-12">
                            <label className="form-label">סיסמא<span className="text-danger f-req">*</span></label>
                            <input className="form-control form-control-sm" name="password" defaultValue={''} />
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12">
                            <hr />
                        </div>
                    </div>
                    <div className='row'>
                        <div className="col-lg-12">
                            <button className="btn btn-primary" type='submit'>כניסה</button>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-lg-12 text-danger">{error}</div>
                    </div>
                </div>
                </div>
                </div>
            </div>
            </form>
        </div>
    )
}

export async function getServerSideProps({ req, res }) {
    return { props: {} }   
}
