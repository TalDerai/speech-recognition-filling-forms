import { MainLayout } from '../components/MainLayout'

export default function ErrorPage({ items, amount, user }) {
    return (
        <MainLayout title={'ניהול קופות: הדף אינו קיים'} active='' user={''}>            
            <div className='text-center pt-5 pb-5 frm-panel'>
            <h5 className="text-danger">הדף אינו קיים</h5>
            </div>
        </MainLayout>
    )
}