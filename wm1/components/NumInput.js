// NOT IN USE 
import { useState } from "react"

export default ({val,placeholder,disabled,cb}) => {
    
    const addCommas = (num) => num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
    const removeNonNumeric = (num) => num.toString().replace(/[^0-9]/g, "")

    const [value, setValue] = useState(val ? addCommas(removeNonNumeric(val)) : undefined)

    const handleChange = (event) => {
        setValue(addCommas(removeNonNumeric(event.target.value)))
        if(value){
            const reg =new RegExp(',','g')
            const v = parseFloat(value.replace(reg,''))            
            cb(v)
        }            
        else
            cb(null) 
    }

    return <input type="text" value={value} className="form-control form-control-sm c-ltr" 
        onChange={handleChange} placeholder={placeholder} disabled={disabled}/>
}