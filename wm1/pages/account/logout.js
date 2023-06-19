import {withSession} from "../../utils/session"

export default function Logout(props) {
    return (<></>)
}

export const getServerSideProps = withSession(async function ({ req, res }) {    
    req.session.destroy()
    res.setHeader("location", "../account/login")
    res.statusCode = 302
    return {
        redirect: {
            permanent: false,
            destination: "/account/login",
        },
        props: {},
    }
}) 