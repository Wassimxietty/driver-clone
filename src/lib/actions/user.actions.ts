'use server'

import { ID, Query } from "node-appwrite";
import { createAdmingClient, createSessionClient } from "../appwrite";
import { appwriteConfig } from "../appwrite/config";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { avatarPlaceholderUrl } from "../../../constants";
import { redirect } from "next/navigation";

export const createAccount = async({fullName, email} : {fullName:string, email:string}) => {
    const existingUser = await getUserByEmail(email);

    const accountId = await sendEmailOTP({email})

    if(!accountId) throw new Error('Failed to send OTP');
    if(!existingUser){
        const {databases} = await createAdmingClient();
        await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.usersCollectionId,
            ID.unique(),
            {
                fullName,
                email,
                avatar: avatarPlaceholderUrl,
                accountId,
            }
        );
    }
    return parseStringify({accountId});
}

export const getCurrentUser = async() => {
    const {databases, account} = await createSessionClient();
    const result = await account.get();

    const user = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal('accountId', result.$id)]
    )
    return user.total > 0 ? parseStringify(user.documents[0]) : null
}

export const signOutUser = async()=>{
    const {account} = await createSessionClient();
    try{
        // Delete the current session to log out
        await account.deleteSession('current');
        (await cookies()).delete("appwrite-session");
    } catch(error){
        handleErr(error, 'Failed to sign out user')
    } finally {
        redirect('/sign-in')
    }
}

export const signInUser = async({email} : {email:string})=>{
    try{
        const existingUser = await getUserByEmail(email);
        //User exists, send OTP
        if(existingUser){
            await sendEmailOTP({email});
            return parseStringify({ accountId: existingUser.accountId });
        }
        return parseStringify({accountId: null, error: "User not found"})
    } catch(err){
        handleErr(err, 'Failed to sign in user')
    }
}

export const verifySecret = async({accountId, password} : {accountId: string, password:string}) => {
    try{
        const {account} = await createAdmingClient();
        const session = await account.createSession(accountId, password);
        (await cookies()).set('appwrite-session', session.secret, {
            path: '/',
            httpOnly: true,
            sameSite: 'strict',
            secure: true 
        })
        return parseStringify({sessionId: session.$id})
    } catch(err){
        handleErr(err, 'some error in verifying OTP')
    }
}

const getUserByEmail = async(email:string) => {
    const {databases} = await createAdmingClient();
    const result = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.usersCollectionId,
        [Query.equal('email', [email])]
    );

    return result.total > 0 ? result.documents[0] : null
}

export const sendEmailOTP = async({email}: {email:string}) => {
    const {account} = await createAdmingClient();

    try {
        const session = await account.createEmailToken(ID.unique(), email);
        return session.userId;
    } catch(err){
        handleErr(err, 'Failed to send message OTP')
    }
}   

// export const updateAvatar = async ({email, url}:{
//     email: string;
//     url: string;
// }) => {
//     const {databases} = await createAdmingClient();
//     try {
//         const user = await getUserByEmail(email);
//         const updateFile = await databases.updateDocument(
//             appwriteConfig.databaseId,
//             appwriteConfig.usersCollectionId,
//             user.$id,
//             {
//                 avatar: url
//             });
//         return parseStringify(updateFile);
//     } catch (error) {
//         handleErr(error, "Failed to rename the file.")
//     }
// }

const handleErr = (error:unknown, message:string)=>{
    console.log(error, message);
    throw error;
}