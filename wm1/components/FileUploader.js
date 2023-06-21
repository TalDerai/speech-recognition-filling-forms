import { useState } from 'react'
import { FileUploader as Uploader } from "react-drag-drop-files"

export default function FileUploader({ tp, id, onError, onSuccess }) { //f, 
    const [isLoading, setLoading] = useState(false)
    const fileTypes = ["JPEG", "JPG", "PNG", "GIF", "DOC", "DOCX", "TXT", "PDF"]

    const stopLoadingSpin = () => {
        setTimeout(() => {
            setLoading(false)
        }, 3000)
    }

    const handleChange = async (file) => { 
        setLoading(true)

        uploadToServer(file)
            .then(() => {
                console.log('ok')
                stopLoadingSpin()
                onSuccess()
            })
            .catch(error => {
                console.log(error)
                stopLoadingSpin()
            })

    }

    const error = (msg) => {
        onError(msg)
    }

    const uploadToServer = async (file) => {
        const body = new FormData()
        body.append("file", file)
        const result = await fetch(`/api/file?tp=${tp}&id=${id}`, {
            method: "POST",
            body
        })
        const cont = await result.json()
        console.log('upload result', cont)
    }

    return (
        <div>
            <Uploader
                multiple={false}
                handleChange={handleChange}
                name="file"
                types={fileTypes}
                onTypeError={() => error('סוג של הקובץ שגוי')}
                maxSize="10"
                onSizeError={() => error('גודל של הקובץ שגוי')}
            >
                <div className='custom-file-upload justify-content-center align-self-center'>
                    <br /><br />
                    <div className={`small text-mute text-center ${isLoading ? 'font-bg' : ''}`}>GIF, JPG, PNG, DOC, DOCX, PDF, TXT</div>
                    <div className={`top-25 ${isLoading ? '' : 'd-none'}`}><i className="fa fa-spinner fa-spin fa-2x" aria-hidden="true"></i></div>
                </div>
            </Uploader>
        </div>
    )
}