'use client'
// imports
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
  } from "./ui/alert-dialog"
import { Button } from "./ui/button"
  import {
    InputOTP,
    InputOTPGroup,
    InputOTPSlot,
  } from "./ui/input-otp"
import { sendEmailOTP, verifySecret } from "@/lib/actions/user.actions"
import Image from "next/image"
import { useRouter } from "next/navigation"
import React, { useState } from "react"
  
  
const OTPmodal = ({email, accountId} : {
    email:string,
    accountId:string
}) => {
    const router = useRouter();
    const [isOpen, setIsOpen] = useState(true);
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const handleSubmit = async(e:React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        setIsLoading(true);
        try{
            // call API to verify otp
            const sessionsId = await verifySecret({accountId, password});
            if (sessionsId) router.push('/');
        } catch(error){
            console.log('failed to verify OTP: ', error)
            throw error;
        }
    }

    const handleResendOTP = async() => {
        try {
            await sendEmailOTP({email});
        } catch(err) {
            console.log('failed to resend')
            throw err;
        }
    }

  return (
    <AlertDialog open={isOpen} onOpenChange={setIsOpen} >
        <AlertDialogContent className="shad-alert-dialog">
            <AlertDialogHeader className="relative flex justify-center">
            <AlertDialogTitle className="h2 text-center">
                Enter OTP
                <Image src="/assets/icons/close-dark.svg" alt="close" height={20} width={20} onClick={()=>setIsOpen(false)} className="otp-close-button" />
            </AlertDialogTitle>
            <AlertDialogDescription className="subtitle-2 text-center text-light-100">
                We have sent a code a code to {" "}<span className="pl-1 text-brand">{email}</span>
            </AlertDialogDescription>
            </AlertDialogHeader>
            <InputOTP maxLength={6} value={password} onChange={setPassword}>
                <InputOTPGroup className="shad-otp">
                    <InputOTPSlot index={0} className="shad-otp-slot"/>
                    <InputOTPSlot index={1} className="shad-otp-slot"/>
                    <InputOTPSlot index={2} className="shad-otp-slot"/>
                    <InputOTPSlot index={3} className="shad-otp-slot"/>
                    <InputOTPSlot index={4} className="shad-otp-slot"/>
                    <InputOTPSlot index={5} className="shad-otp-slot"/>
                </InputOTPGroup>
            </InputOTP>
            <AlertDialogFooter>
                <div className="flex w-full flex-col gap-4">
                <AlertDialogAction 
                    onClick={handleSubmit}
                    className="shad-submit-btn h-12" 
                    type="button"
                    >
                    Submit
                    {isLoading && <Image src="/assets/icons/loader.svg" alt="loader" height={24} width={24} className="ml-2 animate-spin" />}
                </AlertDialogAction>
                </div>
            </AlertDialogFooter>
            <div className="subtitle-2 mt-2 text-center text-light-100">
                Didn&apos;t get a code? 
                <Button type="button" variant="link" className="pl-1  text-brand" onClick={handleResendOTP} >Click to resend</Button>
            </div>
        </AlertDialogContent>
    </AlertDialog>

  )
}

export default OTPmodal