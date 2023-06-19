// not in use
// must be completed with click functions and item list from prop argument
export const PopupMenu = () => {
    return <td className="td-a">
        <li className="d-block dropdown">
            <a className="dropdown-toggle h6" href="#" id="navbarDarkDropdownMenuLink" role="button" data-bs-toggle="dropdown" aria-expanded="false"></a>
            <ul className="dropdown-menu dropdown-menu-dark" aria-labelledby="navbarDarkDropdownMenuLink">
                <li><a className="dropdown-item text" href="#">כרטיס אירוע</a></li>
                <li><a className="dropdown-item" href="#">הפקדה חדשה</a></li>
                <li><a className="dropdown-item" href="#">משיכה חדשה</a></li>
            </ul>
        </li>
    </td>
}

export const PopupMenuHeader = ()=>{
    return <th className="td-a"></th>
}