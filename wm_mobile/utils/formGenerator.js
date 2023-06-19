import { cardModel } from "../utils/cardModel.js"
import moment from 'moment'

export class myForm {
    constructor(type, record) {
        this.action = cardModel[type].Action
        let data = { ...cardModel[type] }
        Object.keys(cardModel[type])
            .filter(p => p !== 'Action')
            .forEach(p => {
                if (p === 'Image' && type === 'worker') {
                    data[p].value = record[p] ? (data.Image.fPath + record[p]) : (data.Image.fPath + '/0.jpg')
                } else if (p === 'EventType' && type === 'event') {
                    data[p].value = record['Amount'] > 0 ? 'הפקדה' : 'משיכה'
                } else if (p === 'Amount' && type === 'event') {
                    data[p].value = Math.abs(record[p])
                } else if (p === 'Desk' && type === 'event') {
                    data[p].values = record['desks']
                    data[p].value = record['DeskId']
                } else if (p === 'Worker' && type === 'event') {
                    data[p].values = record['workers']
                    data[p].value = record['WorkerId']
                } else if (p === 'Method' && type === 'event') {                    
                    data[p].value = record[p]
                    if(record['Amount'] < 0)data[p].type = 'hidden'
                } else {
                    data[p].value = record[p] 
                }
            })
        this.data = data
        //console.log(data)
    }
    render(tab) {
        return (typeof tab === 'undefined')
            ? `<form action="${this.action}" method="post">        
                    ${Object.values(this.data).map(d => this.createItem(d)).join('')}
                    <div class="row mb-0">
                        <div class="col-6"><button type="submit" class="btn form-control font-700 rounded-sm bg-green-dark">שמור</button></div>        
                        <div class="col-6"><button type="button" onclick="history.back()" class="btn form-control font-700 rounded-sm bg-red-light">סגור</button></div>
                    </div>
                </form>`
            : `${Object.values(this.data).filter(d => d.tab === tab).map(d => this.createItem(d)).join('')}`

    }
    createItem(d) {
        switch (d.type) {
            case 'image':
                return `<div class="row text-center mb-0 ${this.data.Id.value===0 ? 'd-none' : ''}">
                            <a class="text-center" href="#" id="aPic" onclick="chooseImage()">
                                <img src="${d.value}" class="preload-img img-fluid rounded-sm max-h-120" alt="img" id="wPic"/>                               
                            </a>
                            <input accept="image/*" type="file" id="wPicInput" name="wPicInput" oninput="setImage()"/>
                        </div>`
            case 'text':
                return `<div class="form-field form-email text-start">
                            <label class="contactNameField color-theme">${d.title}<span>${d.required ? 'שדה חובה' : ''}</span></label>
                            <input type="text" name="${d.name}" value="${d.value}" class="round-small" 
                                ${d.required ? ' required="true" oninvalid="setCustomValidity(\'שדה חובה\')" onchange="setCustomValidity(\'\')" ' : ''}  
                                ${d.ro ? ' disabled="true" ' : ''} placeholder="${d.pl ?? d.title}" />
                        </div>`
            case 'textarea':
                return `<div class="form-field form-email text-start">
                            <label class="contactNameField color-theme">${d.title}<span>${d.required ? 'שדה חובה' : ''}</span></label>
                            <textarea name="${d.name}" value="${d.value}" class="round-small" 
                                ${d.required ? ' required="true" oninvalid="setCustomValidity(\'שדה חובה\')" onchange="setCustomValidity(\'\')" ' : ''} 
                                ${d.ro ? ' disabled="true" ' : ''} placeholder="${d.pl ?? d.title}" rows="2"></textarea>
                        </div>`
            case 'number':
                return `<div class="form-field form-email text-start">
                            <label class="contactNameField color-theme">${d.title}<span>${d.required ? 'שדה חובה' : ''}</span></label>
                            <input type="number" name="${d.name}" value="${d.value}" 
                                ${d.required ? ' required="true" oninvalid="setCustomValidity(\'שדה חובה\')" onchange="setCustomValidity(\'\')" ' : ''} 
                                class="round-small" ${d.ro ? ' disabled="true" ' : ''} placeholder="${d.pl ?? d.title}" />
                        </div>`
            case 'date':
                const date = moment(d.value, 'DD/MM/YYYY').format('YYYY-MM-DD')  
                return `<div class="form-field form-email text-start">
                            <label class="contactNameField color-theme">${d.title}<span>${d.required ? 'שדה חובה' : ''}</span></label>
                            <input type="date" name="${d.name}" value="${date}" class="round-small" 
                                ${d.required ? ' required="true" oninvalid="setCustomValidity(\'שדה חובה\')" onchange="setCustomValidity(\'\')" ' : ''} 
                                ${d.ro ? ' disabled="true" ' : ''} placeholder="${d.pl ?? d.title}" />
                        </div>`
            case 'list':
                return `<div class="form-field form-email text-start">
                            <label class="contactNameField color-theme">${d.title}<span>${d.required ? 'שדה חובה' : ''}</span></label>
                            <div class="input-style has-borders no-icon mb-4">
                                <select name="${d.name}" ${d.ro ? ' disabled="true" ' : ''} 
                                ${d.required ? ' required="true" oninvalid="setCustomValidity(\'שדה חובה\')" onchange="setCustomValidity(\'\')" ' : ''} >
                                    <option value="" disabled selected>--- ${d.pl ?? d.title} ---</option>
                                    ${d.values.map(e => `<option value="${e.v}" ${e.v === d.value ? ' selected ' : ''}>${e.n}</option>`).join('')}                            
                                </select>
                                <span><i class="fa fa-chevron-down"></i></span>
                                <i class="fa fa-check disabled valid color-green-dark"></i>
                                <i class="fa fa-check disabled invalid color-red-dark"></i>
                                <em></em>
                            </div>
                        </div>`
            case 'hidden':
                return `<input type="hidden" name="${d.name}" value="${d.value}" />`
            default:
                return ''
        }
    }
}