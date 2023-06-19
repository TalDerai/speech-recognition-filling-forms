import { useState } from 'react'
import { workerNA, fPath } from '../models/common'
import { FileUploader as Uploader  } from "react-drag-drop-files"

export default function ImageUploader({ imLabel, tp, id, img, disabled, onError, onSuccess }) {
    const [image, setImage] = useState(null)
    const [createObjectURL, setCreateObjectURL] = useState(fPath + (img ?? '/0.jpg'))
    const [isChanged, setChanged] = useState(false)
    const fileTypes = ["JPEG", "PNG", "GIF"]

    const handleChange = (file) => {
        setImage(file)
        setCreateObjectURL(URL.createObjectURL(file))
        setChanged(true)
    }

    const handleReset = () => {
        setCreateObjectURL(fPath + (img ?? '/0.jpg'))
        setImage(null)
        setChanged(false)
    }

    const uploadToServer = async () => {        
        const body = new FormData()
        body.append("file", image)
        await fetch(`/api/file?tp=${tp}&id=${id}`, {
            method: "POST",
            body
        }).then(() => {
            console.log('ok')          
            onSuccess()
        })
        .catch(error => {
            console.log(error)
            onError('בעיה בהעלאת קבצים')
        })
    }

    const error = (msg) => {
        onError(msg)
    }

    return (
        <div className='text-center'>
            <div className='text-center custom-image-upload'>
                <Uploader
                    multiple={false}
                    handleChange={handleChange}
                    name="file"
                    types={fileTypes}
                    onTypeError={() => error('סוג של הקובץ שגוי')}
                    maxSize="10"
                    onSizeError={() => error('גודל של הקובץ שגוי')}
                    disabled={disabled}
                >
                    <div><img src={createObjectURL ?? workerNA} className='img-fluid' /></div>
                    {
                        disabled ? <div className='t-grey'>{imLabel}</div> : <span>{imLabel}</span>
                    }
                </Uploader>

            </div>
            <button
                className={`btn btn-sm btn-success ${isChanged ? '' : 'd-none'}`}
                type="submit"
                onClick={uploadToServer}
                disabled={disabled}
            >
                שמור תמונה
            </button>
            <div className={`text-center ${isChanged ? '' : 'd-none'}`}>
                <p className='small d-none'>{image ? `קובץ: ${image.name}` : ""}</p>
                <p className='small'><a href='#' onClick={() => handleReset()}>איתחול</a></p>
            </div>
        </div>
    )
}