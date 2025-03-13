'use server'

import { createAdmingClient, createSessionClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "../appwrite/config";
import { ID, Models, Query } from "node-appwrite";
import { constructFileUrl, getFileType, parseStringify } from "../utils";
import { revalidatePath } from "next/cache";
import { getCurrentUser } from "./user.actions";

const handleErr = (error:unknown, message:string)=>{
    console.log(error, message);
    throw error;
}

export const uploadFile = async ({file, ownerID, accountID, path}: UploadFileProps) => {
    const {storage, databases} = await createAdmingClient();
    try {
        const inputFile = InputFile.fromBuffer(file, file.name);
        //storing the actual file in the storage
        const bucketFile = await storage.createFile(appwriteConfig.bucketId, ID.unique(), inputFile);
        const fileDocument = {
            type: getFileType(bucketFile.name).type,
            name: bucketFile.name,
            url: constructFileUrl(bucketFile.$id),
            extension: getFileType(bucketFile.name).extension,
            size: bucketFile.sizeOriginal,
            owner: ownerID, 
            accountId: accountID, 
            users: [],
            bucketFileID: bucketFile.$id
        }
        // we're storing the metadata of the file in the database
        const newFile = await databases.createDocument(
            appwriteConfig.databaseId, //specify Database
            appwriteConfig.filesCollectionId, //specify which collection
            ID.unique(), //give unique id
            fileDocument //the actual file we're storing 
        ) .catch(async (error:unknown)=>{
            await storage.deleteFile(appwriteConfig.bucketId, bucketFile.$id)
            handleErr(error, "Failed to create file document")
        });
        revalidatePath(path);
        return parseStringify(newFile);
    } catch(err) {
        handleErr(err, "failed to upload files");
    }
};

export const getFiles = async ({types = [], searchText='', sort='$createdAt-desc', limit}: GetFilesProps) => {
    const {databases} = await createAdmingClient();
    try {
        const currentUser = await getCurrentUser();
        if(!currentUser) throw new Error("User not found");
        const queries = createQueries(currentUser, types, searchText, sort, limit);
        // console.log({currentUser, queries})
        const files = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            queries
        )
        // console.log({files});
        return parseStringify(files);
    } catch (error) {
        handleErr(error, "failed to retrieve files !!")
    }
}


export const doesFileExistByName = async (fileName: string) => {
    const {storage} = await createAdmingClient();
    try {
      const response = await storage.listFiles(appwriteConfig.bucketId);
      return response.files.some(file => file.name === fileName);
    } catch (error) {
      console.error("Error listing files:", error);
      return false;
    }
  }
  
const createQueries = (
    currentUser: Models.Document, 
    types : string[], 
    searchText: string, 
    sort:string, 
    limit?: number
) => {
    const queries = [
        Query.or([
            Query.equal("owner", [currentUser.$id]),
            Query.contains("users", [currentUser.email])
        ])
    ];
    if (types.length>0) queries.push(Query.equal('type', types));
    if (searchText) queries.push(Query.contains('name', searchText));
    if (limit) queries.push(Query.limit(limit));
    if (sort){
        const [sortBy, orderBy] = sort.split("-");
        queries.push(orderBy=== 'asc' ? Query.orderAsc(sortBy) : Query.orderDesc(sortBy))
    }
    // console.log(queries);
    return queries;
}

export const renameFile = async ({fileId, name, extension, path}:RenameFileProps) => {
    const {databases} = await createAdmingClient();
    try {
        const nameWithoutExtension = name.split(".").slice(0, -1).join(".");
        // console.log("here you GOOOO: ", nameWithoutExtension)
        let newName ;
        if(nameWithoutExtension.length <= 1) newName = `${name}.${extension}`;
        else newName = `${nameWithoutExtension}.${extension}`;
        const updateFile = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,
            {
                name: newName
            });
        revalidatePath(path);
        return parseStringify(updateFile);
    } catch (error) {
        handleErr(error, "Failed to rename the file.")
    }
}

export const deleteFile = async ({fileId, bucketFileId, path}:DeleteFileProps) => {
    const {storage, databases} = await createAdmingClient();
    try {
        const deletedFile = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId
        );
        if (deletedFile){
            await storage.deleteFile(appwriteConfig.bucketId, bucketFileId);
        }
        revalidatePath(path);
        return parseStringify({status: "success"});
    } catch (error) {
        handleErr(error, "Failed to delete the file.")
    }
}

export const shareFile = async ({fileId, emails, path}:UpdateFileUsersProps) => {
    const {databases} = await createAdmingClient();
    try {
        const updateFile = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.filesCollectionId,
            fileId,
            {
                users: emails,
            });
        revalidatePath(path);
        return parseStringify(updateFile);
    } catch (error) {
        handleErr(error, "Failed to share the file.")
    }
}

export async function getTotalSpaceUsed() {
    try {
      const { databases } = await createSessionClient();
      const currentUser = await getCurrentUser();
      if (!currentUser) throw new Error('User is not authenticated.');
  
      const files = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.filesCollectionId,
        [Query.equal('owner', [currentUser.$id])],
      );
    //   console.log(files.documents);
      const totalSpace = {
        image: { size: 0, latestDate: '' },
        document: { size: 0, latestDate: '' },
        video: { size: 0, latestDate: '' },
        audio: { size: 0, latestDate: '' },
        other: { size: 0, latestDate: '' },
        used: 0,
        all: 2 * 1024 * 1024 * 1024 /* 2GB available bucket storage */,
      };
  
      files.documents.forEach((file) => {
        const fileType = file.type as FileType;
        console.log(fileType)
        totalSpace[fileType].size += file.size;
        totalSpace.used += file.size;
  
        if (
          !totalSpace[fileType].latestDate ||
          new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate)
        ) {
          totalSpace[fileType].latestDate = file.$updatedAt;
        }
      });
      console.log(totalSpace)
      return parseStringify(totalSpace);
    } catch (error) {
      handleErr(error, 'Error calculating total space used:');
    }
  }
  

