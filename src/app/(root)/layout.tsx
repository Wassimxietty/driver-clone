import Header from '../../../components/Header'
import MobileNavigation from '../../../components/MobileNavigation'
import SideBar from '../../../components/SideBar'
import React from 'react'
import { getCurrentUser } from '@/lib/actions/user.actions'
import { redirect } from 'next/navigation'
import { Toaster } from 'sonner'

export const dynamic = 'force-dynamic'; //will make the page render on the server on each request
const layout = async ({children}: {children:React.ReactNode}) => {
    const currentUser = await getCurrentUser();
    console.log(currentUser);
    if(!currentUser) return redirect("/sign-in") 
  return (
    <main className='flex h-screen'>
        <SideBar {...currentUser}/>
        <section className='flex h-full flex-1 flex-col'>
            <MobileNavigation {...currentUser}/>
            <Header userID={currentUser.$id} accountID={currentUser.accountId} />
            <div className='main-content'>
                {children}
            </div>
        </section>
        <Toaster richColors  closeButton />
    </main>
  )
}

export default layout