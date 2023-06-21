// 0 - deposit, 1 - opened, 2 - closed, 3 - archive 
export default ({ status }) => {
    const statusIcon = (st) => {
        switch (st) {
            case 0:
                return <i className="fa fa-calendar-plus-o text-success" title='אירוע הפקדה'></i>
            case 1:
                return <i className="fa fa-unlock text-danger" title='אירוע משיכה פתוח'></i>
            case 2:
                return <i className="fa fa-lock text-secondary" title='אירוע משיכה סגור'></i>
            case 3:
                return <i className="fa fa-archive text-secondary" title='אירוע בארכיון'></i>
            default:
                return ''
        }
    }
    return statusIcon(status)
}