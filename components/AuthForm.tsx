"use client"
// imports
import React, { useEffect, useState } from 'react'
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "./ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form"
import { Input } from "./ui/input"
import Image from 'next/image'
import Link from 'next/link'
import { createAccount, getCurrentUser, signInUser } from '@/lib/actions/user.actions'
import OTPmodal from './OTPmodal'
import { useRouter } from 'next/navigation'

type formType = 'sign-in' | 'sign-up';

const authFormSchema = (formType: formType) => {
  return z.object({
    email: z.string().email(),
    fullName: formType === 'sign-up' 
    ? z.string().min(2).max(50) 
    : z.string().optional(),
  });
};
const AuthForm = ({type}: { type: formType }) => {
  const [isLoading, setIsLoading] = useState(false)
  const [errorMessage, setErrorMessage] = useState("")
  const [accountId, setAccountId] = useState(null);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const checkUserSignedIn = async () => {
      const currentUser = await getCurrentUser();
      if (currentUser)  {
        setIsSignedIn(true)
        return router.replace("/");
      }
      else setIsSignedIn(false);
    }
    checkUserSignedIn();
  }, [isSignedIn, router])
   
  const formSchema = authFormSchema(type);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fullName: "",
      email: ""
    },
  })
  const onSubmit = async(values: z.infer<typeof formSchema>) => {
    setIsLoading(true);
    setErrorMessage('');
    try{
      const user = 
        type==='sign-up' 
        ? await createAccount({
        fullName:values.fullName || '',
        email:values.email
      })
      : await signInUser({email:values.email});
      setAccountId(user.accountId);
    } catch {
      setErrorMessage('Failed to create account. Please try again.');
    } finally {
      setIsLoading(false);
    }
   
  }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="auth-form">
          <h1 className='form-title'>{type === "sign-in" ? "Sign-in" : "Sign-up"}</h1>
          {type === "sign-up" && (
            <FormField
            control={form.control}
            name="fullName"
            render={({ field }) => (
              <FormItem>
                <div className='shad-form-item'>
                  <FormLabel className='shad-form-label'>Full name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your full name"
                      className='shad-input'
                      {...field} />
                  </FormControl>
                </div>
                <FormMessage className='shad-form-message' />
              </FormItem>
            )}
          />)}
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <div className='shad-form-item'>
                  <FormLabel className='shad-form-label'>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter your email"
                      className='shad-input'
                      {...field} />
                  </FormControl>
                </div>
                <FormMessage className='shad-form-message' />
              </FormItem>
            )}
          />
          <Button type="submit" className='form-submit-button' disabled={isLoading}
          >
            {type === "sign-in" ? "Sign in" : "Sign up"}
            {isLoading && (
              <Image 
                src="/assets/icons/loader.svg"
                alt="loader"
                width={24}
                height={24}
                className="ml-2 animate-spin"/>
            )}
          </Button>
          {errorMessage && (
            <p className='error-message'>{errorMessage}</p>
          )}
          <div className='body-2 flex justify-center'>
            <p>
              {type == 'sign-in' ? 
                "Don't have an account ?" : 
                "Already have an account ?"}
            </p>
            <Link href={type==='sign-in' ? "/sign-up" : "/sign-in"} className='ml-1 font-medium text-brand capitalize'>
                {type==="sign-in" ? "sign up" : "sign in"}
            </Link>
          </div>
        </form>
        {/* OTP VERIFICATION */}
        {accountId && <OTPmodal email={form.getValues('email')}
                                accountId={accountId} />}
      </Form>
    </>
  )
}

export default AuthForm;

