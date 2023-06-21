import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'

export default function DatePickerHe({name,selectedDate,cbChange,disabled}) {
    const days = ['י', 'א', 'ב', 'ג', 'ד', 'ה', 'ו']
    const months = ['ינואר', 'פברואר', 'מרס', 'אפריל', 'מאי', 'יוני', 'יולי', 'אוגיסט', 'ספטמבר', 'אוקטובר', 'נובמבר', 'דצמבר']

    const locale = {
        localize: {
            day: n => days[n],
            month: n => months[n]
        },
        formatLong: {
            date: () => 'dd/MM/yyyy'
        }
    }

    return <DatePicker locale={locale} selected={selectedDate} onChange={date => cbChange(date)}
        dateFormat="dd/MM/yyyy" name={name} onChangeRaw={(e) => e.preventDefault()}
        className={disabled ? 'dp-disabled' : ''} disabled={disabled} />
}