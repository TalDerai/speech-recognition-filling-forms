import Head from "next/head"
import Link from "next/link"

export function MainLayout({ children, title = "ניהול קופות", active, user }) {
  const icon = ['א', 'ע', 'מ'][user.Permission - 1]
  const tooltip = ['אורח', 'עובד', 'מנהל'][user.Permission - 1]
  const badge = ['secondary', 'info', 'danger'][user.Permission - 1]
  return (
    <>
      <script src="https://code.jquery.com/jquery-3.6.0.min.js" integrity="sha256-/xUj+3OJU5yExlq6GSYGSHk7tPXikynS7ogEvDej/m4=" crossOrigin="anonymous"></script>
      <script src="https://code.jquery.com/ui/1.13.1/jquery-ui.min.js" integrity="sha256-eTyxS0rkjpLEo16uXTS0uVCS4815lc40K2iVpWDvdSY=" crossOrigin="anonymous"></script>
      <Head>
        <title>{title}</title>

        {/*  <meta charSet="utf-8" /> */}
        {/*  <meta httpEquiv="X-UA-Compatible" content="IE=edge" /> */}
        <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />

      </Head>

      <link rel="apple-touch-icon" sizes="180x180" href="app/icons/icon-192x192.png" />
      <link rel="shortcut icon" type="image/x-icon" href='../images/w1.png.ico' />
      <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css" />
      {/* <link rel="stylesheet" href="../styles/common.css" /> */}
      <div className="container-fluid" dir="rtl" lang="he">
        <div className="small d-flex mt-1 mb-1">
          <div className="text-secondary"><b>מערכת לניהול קופות</b></div>
          <div className={!user.Id ? 'd-none' : 'ml-auto'}>
            <section className='d-inline'><span>שלום</span> <b>{user.Name}</b> <span className={`user-level-a badge badge-${badge}`} title={tooltip}>{icon}</span></section>
            <Link href={"/account/logout"}>
              <a className="ml-3">יציאה</a>
            </Link>
          </div>
        </div>
        <nav className={user ? "navbar navbar-expand-lg bg-dark" : "d-none"}>
          <div className="container-links">
            <Link href={"/events"}>
              <a className={active === 'events' ? 'active' : ''}>אירועים</a>
            </Link>
            {
              user.Permission === 3 && <Link href={"/workers"}>
                <a className={active === 'workers' ? 'active' : ''}>עובדים</a>
              </Link>
            }
            <Link href={"/desks"}>
              <a className={active === 'desks' ? 'active' : ''}>קופות</a>
            </Link>
            <Link href={"/reports"}>
              <a className={active === 'reports' ? 'active' : ''}>דוחות</a>
            </Link>
          </div>
        </nav>
        <main>{children}</main>
      </div>
      <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.2.0/dist/js/bootstrap.bundle.min.js"
        integrity="sha384-A3rJD856KowSb7dwlZdYEkO39Gagi7vIsF0jrRAoQmDKKtQBHUuLZ9AsSv4jD4Xa" crossOrigin="anonymous"></script>
    </>
  )
}