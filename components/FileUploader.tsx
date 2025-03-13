'use client';
import React, {useCallback, useState} from 'react'
import {useDropzone} from 'react-dropzone'
import { Button } from './ui/button';
import { cn, convertFileToUrl, getFileType } from '@/lib/utils';
import Image from 'next/image';
import Thumbnail from './Thumbnail';
import { MAX_FILE_SIZE } from '../constants';
import { toast } from "sonner"
import { doesFileExistByName, uploadFile } from '@/lib/actions/file.actions';
import { usePathname } from 'next/navigation';

interface Props {
  ownerID: string;
  accountID: string;
  className?: string;
}

const FileUploader = ({ownerID, accountID, className}: Props) => {
  const path = usePathname();
  const [files, setFiles] = useState<File[]>([]); 

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    // Do something with the files
    const filteredFiles: File[] = [];
      for (const file of acceptedFiles) {
        // Check if file already exists in storage
        const exists = await doesFileExistByName(file.name);
        if (exists) {
          toast.error(
            <p className='body-2'>
              <span className='font-semibold'>{file.name}</span> already exists!
            </p>
          )
          continue;
        }
        

        if(file.size > MAX_FILE_SIZE){
          setFiles((prevFiles) => prevFiles.filter((f)=>f.name !== file.name));
          toast.error(
            <div>
              <p className='body-2'>
              <span className='font-semibold'>{file.name}</span> is too large.
              Max file is size 50MB.
              </p>
            </div>
          )
          continue;
        }
        filteredFiles.push(file);
      }
    if (filteredFiles.length === 0) return; // No files to upload
    console.log(filteredFiles)
    setFiles(filteredFiles);

    const uploadPromises = filteredFiles.map(async (file) => {
      return uploadFile({file, ownerID, accountID, path}).then((uploadedFile)=>{
        if(uploadedFile){
          setFiles((prevFiles) => prevFiles.filter((f)=>f.name !== file.name));
        }
      })
    })
    // want to wait for it 
    await Promise.all(uploadPromises);
  }, [ownerID, accountID, path])

  const {getRootProps, getInputProps, isDragActive} = useDropzone({onDrop})

  const handleRemoveFile = (e:React.MouseEvent<HTMLImageElement, MouseEvent>, fileName: string) => {
    e.stopPropagation();
    setFiles((prevFiles)=>prevFiles.filter((file) => file.name !== fileName))
  }

  return (
    <div {...getRootProps()} className='cursor-pointer'>
      <input {...getInputProps()} />
      <Button type='button' className={cn('uploader-button', className)}>
        <Image src='/assets/icons/upload.svg' alt='upload button' height={24} width={24}  />
        <p>Upload</p>
      </Button>
      {files.length > 0 && (
        <ul className='uploader-preview-list'>
          <h4 className='h4 text-light-100'>Uploading</h4>
          {files.map((file, index) =>{
            const {type, extension} = getFileType(file.name);
            return(
              <li key={`${file.name}-${index}`} className='uploader-preview-item'>
                <div className='flex items-center gap-3'>
                  <Thumbnail 
                    type={type}
                    extension={extension}
                    url={convertFileToUrl(file)} imageClassName={''} className={''} />
                </div>
                <div className='preview-item-name'>
                  {file.name}
                  <Image src="/assets/icons/file-loader.gif" alt='file loader' height={26} width={80} />
                </div>
                <Image src="/assets/icons/remove.svg" alt='Remove' height={24} width={24} onClick={(e)=>handleRemoveFile(e, file.name)} />
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )

}

export default FileUploader