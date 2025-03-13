import React from 'react'
import { Button } from './ui/button'
import Image from 'next/image'
import FileUploader from './FileUploader'
import { signOutUser } from '@/lib/actions/user.actions'
import Search from './Search'

const Header = ({userID, accountID}: {
  userID: string; accountID: string;
}) => {
  return (
    <header className='header'>
        <Search />
        <div className='header-wrapper'>
            <FileUploader ownerID={userID} accountID={accountID} />
            <form action={async () => {
              'use server';
              await signOutUser();
            }}>
                <Button type='submit' className='sign-out-button'>
                    <Image src="/assets/icons/logout.svg" alt='logo' 
                            height={24}  width={24} className='w-6'/>
                </Button>
            </form>
        </div>
    </header>
  )
}

export default Header