import { Html, Head, Main, NextScript } from 'next/document'
import Container from 'react-bootstrap/Container'

export default function Document(props) {
  return (
    <Html>
      <Head/>
      <body dir="rtl" lang="he">
        <Container>
          <Main />
        </Container>
        <NextScript />        
      </body>
    </Html>
  )
}