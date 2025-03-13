'use client'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet"
import { Separator } from "@radix-ui/react-separator";
import Image from "next/image"
import { usePathname } from 'next/navigation';
import { useState } from "react";
import { navItems } from "../constants";
import Link from "next/link";
import { cn } from "@/lib/utils";
import FileUploader from "./FileUploader";
import { Button } from "./ui/button";
import { signOutUser } from "@/lib/actions/user.actions";

type Props = {
  $id: string,
  accountId: string, 
  fullName: string, 
  avatar: string, 
  email: string
}

const MobileNavigation = ({$id: ownerId, accountId, fullName, avatar, email} : Props) => {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  return (
    <header className="mobile-header">
      <div className="flex flex-row gap-3 h-auto sm:hidden">
        <Image 
          src="/assets/icons/logo-brand.svg"
          alt="logo"
          width={52}
          height={52} />
        <h1 className="h2 text-brand-100 my-auto">MDrive</h1>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetTrigger>
          <Image 
            src="/assets/icons/menu.svg"
            alt="search"
            height={30}
            width={30} />
        </SheetTrigger>
        <SheetContent className="shad-sheet h-screen px-3">
            <SheetTitle className="header-user">
            <Image 
              src={avatar}
              alt="avatar"
              height={44}
              width={44} 
              className="header-user-avatar"/>
              <div className="sm:hidden lg:block">
                <p className="subtitle-2 capitalize">{fullName}</p>
                <p className="caption">{email}</p>
              </div>
              <Separator className="mb-4 bg-light-200/20"/>
            </SheetTitle>
            <nav className="mobile-nav">
              <ul className="mobile-nav-list">
              {navItems.map(({url, name, icon})=>{
              return(
                <Link key={name} href={url} className="lg:w-full">
                  <li className={cn("mobile-nav-item", 
                    pathname === url && "shad-active")}>
                    <Image 
                      src={icon}
                      alt="icon"
                      width={24}
                      height={24}
                      className={cn('nav-icon',
                        pathname === url && "nav-icon-active"
                      )} />
                    <p>{name}</p>
                  </li>
                </Link>
                )
               })}
              </ul>
            </nav>
            <Separator className="my-5 bg-light-200/20" />
            <div className="flex flex-col justify-between gap-5 pb-5">
              <FileUploader ownerID={ownerId} accountID={accountId}  />
              <Button type="submit" className="mobile-sign-out-button" onClick={async ()=>await signOutUser()}>
                <Image 
                    src="/assets/icons/logout.svg"
                    alt="logo"
                    width={24}
                    height={24} />
                <p>logout</p>
              </Button>
            </div>
        </SheetContent>
    </Sheet>
    </header>
  )
}

export default MobileNavigation