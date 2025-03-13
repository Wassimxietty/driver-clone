import Image from 'next/image'
import React from 'react'

const layout = ({children}: {children: React.ReactNode}) => {
  return (
    <div className='flex min-h-screen'>
        <section className='hidden p-12 w-1/2 items-center justify-center bg-brand lg:flex xl:w-2/5 '>
            <div className='flex flex-col gap-28'>
                <div className='flex flex-row gap-5 mt-16'>
                    <Image src="/logo.svg" alt='logo' width={64} height={64}  className='h-auto'/>
                    <h1 className='h1 text-white pt-2'>MDrive</h1>
                </div>
                <div className='space-y-5 text-white'>
                    <h1 className='h1'>Manage your files the best way</h1>
                    <p className='body-1 w-5/6'>Awesome, we&apos;ve created the perfect place for you to store all your documents.</p>
                </div>
                <div className='flex-center'>
                    <Image src="/assets/images/illust.png" alt='illust' width={342} height={342}  className='transition-all hover:rotate-2 hover:scale-105'/>
                </div>
            </div>
        </section>
        <section className="flex flex-1 flex-col items-center bg-white p-4 py-10 lg:justify-center lg:p-10 lg:py-0">
        <div className="mb-16 lg:hidden">
          <Image
            src="/assets/icons/logo-full-brand.svg"
            alt="logo"
            width={224}
            height={82}
            className="h-auto w-[200px] lg:w-[250px]"
          />
        </div>
        {children}
        </section>
    </div>
  )
}

export default layout