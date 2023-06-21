import Link from "next/link"

export default ({ w, d, h, k}) => {
    return <span className="w-30">
        <Link href={`/events/0?dep=1&sw=${w}&sd=${d}`}>
            <a title='הפקדה חדשה'><i className={`fa fa-plus-square${h === k ? '' : '-o'} text-success`} aria-hidden="true"></i></a>
            </Link>&nbsp;&nbsp;
        <Link href={`/events/0?dep=0&sw=${w}&sd=${d}`}>
            <a title='משיכה חדשה'><i className={`fa fa-minus-square${h === k ? '' : '-o'} text-danger`} aria-hidden="true"></i></a></Link>
    </span>
}