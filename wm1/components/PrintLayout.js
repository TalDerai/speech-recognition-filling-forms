import Head from "next/head"

export function PrintLayout({ children, title = "ניהול קופות" }) {
    return (
        <div className="container-fluid pb-4 mt-2">
            <Head>
                <title>{title}</title>
                <meta charSet="utf-8" />
            </Head>
            <nav className="navbar navbar-expand-lg bg-dark d-flex b-print">
                <button className="btn btn-primary ml-auto" onClick={()=>window.print()}>הדפס</button>
            </nav>
            <main>{children}</main>
        </div>
    )
}
