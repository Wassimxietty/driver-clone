import React from 'react'
import { getFiles, getTotalSpaceUsed } from '@/lib/actions/file.actions';
import { Models } from 'node-appwrite';
import Card from '../../../../components/Card';
import Sort from '../../../../components/Sort';
import { convertFileSize, getFileTypesParams } from '@/lib/utils';

const page = async ({searchParams, params}: SearchParamProps) => {
    const type = (await params)?.type as string || "";
    const sizeArray = await getTotalSpaceUsed();
    const sizeType = type.slice(0, -1);
    const size = sizeArray[sizeType] && sizeArray[sizeType].size !== undefined 
    ? sizeArray[sizeType].size 
    : '0';
    const searchText = (await searchParams)?.query as string || '' ;
    const sort = (await searchParams)?.sort as string || '' ;
    const types = getFileTypesParams(type) as FileType[];
    const files = await getFiles({types: types, searchText, sort});
    // console.log("sizeArray: ", sizeArray, "sizeType:", sizeType, "size: ", size);

  return (
    <div className='page-container'>
        <section className='w-full'>
            <h1 className='h1 capitalize'>{type}</h1>
            <div className='total-size-section'>
                <p className='body-1'>total: <span className='h5'>{convertFileSize(size)}</span></p>
                <div className='sort-container'>
                    <p className='body-1 hidden sm:block text-light-200'>Sort by:</p>
                    <Sort />
                </div>
            </div>
        </section>
        {/* RENDER THE FILES */}
        {files.total > 0 ? (
            <section className='file-list'>
                {files.documents.map((file: Models.Document) => (
                    <Card key={file.$id} file={file} />
                ))}
            </section>
        ): <p className='empty-list'> No files to upload</p> }
    </div>
  )
}

export default page