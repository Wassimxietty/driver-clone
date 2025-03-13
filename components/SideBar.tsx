"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import { navItems } from "../constants";
import { cn } from "@/lib/utils";
// import {
//   Dialog,
//   DialogClose,
//   DialogContent,
//   DialogDescription,
//   DialogFooter,
//   DialogHeader,
//   DialogTitle,
//   DialogTrigger,
// } from "./ui/dialog"
// import { Button } from "./ui/button";
// import { Input } from "./ui/input";
// import { Label } from "./ui/label";
// import { useState } from "react";
// import { updateAvatar } from "@/lib/actions/user.actions";


interface Props {
    fullName: string,
    avatar: string,
    email: string
}


const SideBar = ({ fullName, avatar, email }: Props) => {
  // const [isModalOpen, setIsModalOpen] = useState(false);
  // const [isLoading, setIsLoading] = useState(false);
  // const [url, setUrl] = useState<string>("");

  // const closeAllModals = () => {
  //         setIsModalOpen(false);
          
  //     };
  
  // const handleAction = async () => {
  //     setIsLoading(true);
  //     let success = false;
  //     success = await updateAvatar({email, url});
  //     if(success) closeAllModals();
  //     setIsLoading(false)
  // }
  const pathname = usePathname();
//   const renderDialogContent = ()=>{
//     return (
//       <DialogContent className="shad-dialog button">
//         <DialogHeader className='flex flex-col gap-5'>
//           <DialogTitle className='text-center text-light-100'>Share url</DialogTitle>
//           <DialogDescription>
//             Anyone who has this url will be able to view this.
//           </DialogDescription>
//         </DialogHeader>
//         <div className="flex items-center space-x-2">
//           <div className="grid flex-1 gap-2">
//             <Label htmlFor="url" className="sr-only">
//               url
//             </Label>
//             <Input
//               type="url"
//               placeholder="Enter your url here..."
//               onChange={(e)=>setUrl(e.target.value)}
//               value={url}
//             />
//           </div>
//         </div>
//         <DialogFooter className='flex flex-col gap-3 md:flex-row'>
//             <Button onClick={closeAllModals} className='modal-cancel-button'>Cancel</Button>
//             <Button onClick={handleAction} className='modal-submit-button'>
//                 <p className='capitalize'>confirm </p>
//                 {isLoading && (
//                     <Image src="/assets/icons/loader.svg" alt='loader' width={24} height={24} className='animate-spin' />
//                 )}
//             </Button>
//         </DialogFooter>
//       </DialogContent>
//       );
// }
  return (
    <aside className="sidebar">
            <Link href="#">
                <div className="flex flex-row gap-4">
                  <Image 
                      src="/assets/icons/logo-brand.svg"
                      alt="logo"
                      height={62}
                      width={62}
                      className="hidden h-auto lg:block"
                      />
                  <h1 className="h1 text-brand-100 my-auto hidden lg:block">MDrive</h1>
                </div>
                <Image
                src="/assets/icons/logo-brand.svg"
                alt="logo"
                width={52}
                height={52}
                className="lg:hidden"
                />
            </Link>
          <nav className="sidebar-nav">
              <ul className="flex flex-col flex-1 gap-6">
                {navItems.map(({url, name, icon})=>{
                  return(
                    <Link key={name} href={url} className="lg:w-full">
                      <li className={cn("sidebar-nav-item", 
                        pathname === url && "shad-active")}>
                        <Image 
                          src={icon}
                          alt="icon"
                          width={24}
                          height={24}
                          className={cn('nav-icon',
                            pathname === url && "nav-icon-active"
                          )} />
                        <p className="hidden lg:block">{name}</p>
                      </li>
                    </Link>
                  )
                })}
              </ul>
          </nav>
          <Image
              src="/assets/images/files-2.png"
              alt="files"
              width={506}
              height={418}
              className="w-full" />
          <div className="sidebar-user-info">
          <Image
            src={avatar}
            alt="avatar"
            width={44}
            height={44}
            className="sidebar-user-avatar" />
            <div className="hidden lg:block">
              <p className="subtitle-2 capitalize">{fullName}</p>
              <p className="caption">{email}</p>
            </div>
          </div>
      </aside>
  )
    // IDEA FOR DIALOG OPEN TO CHANGE THE PFP OR PERHAPS SEE A SMALL TAB OPEN FOR PROFILE
    // <Dialog open={isModalOpen} onOpenChange={setIsModalOpen} >
        {/* <aside className="sidebar">
            <Link href="#">
                <div className="flex flex-row gap-4">
                  <Image 
                      src="/assets/icons/logo-brand.svg"
                      alt="logo"
                      height={62}
                      width={62}
                      className="hidden h-auto lg:block"
                      />
                  <h1 className="h1 text-brand-100 my-auto hidden lg:block">MDrive</h1>
                </div>
                <Image
                src="/assets/icons/logo-brand.svg"
                alt="logo"
                width={52}
                height={52}
                className="lg:hidden"
                />
            </Link>
          <nav className="sidebar-nav">
              <ul className="flex flex-col flex-1 gap-6">
                {navItems.map(({url, name, icon})=>{
                  return(
                    <Link key={name} href={url} className="lg:w-full">
                      <li className={cn("sidebar-nav-item", 
                        pathname === url && "shad-active")}>
                        <Image 
                          src={icon}
                          alt="icon"
                          width={24}
                          height={24}
                          className={cn('nav-icon',
                            pathname === url && "nav-icon-active"
                          )} />
                        <p className="hidden lg:block">{name}</p>
                      </li>
                    </Link>
                  )
                })}
              </ul>
          </nav>
          <Image
              src="/assets/images/files-2.png"
              alt="files"
              width={506}
              height={418}
              className="w-full" />
            <DialogTrigger>
              <div className="sidebar-user-info">
              <Image
                src={avatar}
                alt="avatar"
                width={44}
                height={44}
                className="sidebar-user-avatar" />
                <div className="hidden lg:block">
                  <p className="subtitle-2 capitalize">{fullName}</p>
                  <p className="caption">{email}</p>
                </div>
              </div>
            </DialogTrigger>
      </aside>
        {renderDialogContent()}
    </Dialog>
     */}
}

export default SideBar