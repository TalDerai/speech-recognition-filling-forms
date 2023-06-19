import 'bootstrap-v4-rtl/dist/css/bootstrap-rtl.min.css'
import 'font-awesome/css/font-awesome.min.css'
import '../styles/react-select.css'
import 'react-virtualized/styles.css'
import 'react-virtualized-select/styles.css'
import "../styles/common.css"
import Head from 'next/head'

function MyApp({ Component, pageProps }) {
  return <>
    <Head/>      
    <Component {...pageProps} />
  </>
}

export default MyApp