'use client'
import Image from 'next/image'
import React, { useEffect, useRef, useState } from 'react'
import { Input } from './ui/input'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { getFiles } from '@/lib/actions/file.actions'
import { Models } from 'node-appwrite'
import Thumbnail from './Thumbnail'
import FormattedDateTime from './FormattedDateTime'
import { useDebounce} from 'use-debounce'

const Search = () => {
  const [query, setQuery] = useState<string>('');
  const [result, setResult] = useState<Models.Document[]>([]);
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const searchQuery = searchParams.get('query') || '' ;
  const path = usePathname();
  const isMounted = useRef(false); // ✅ Persistent ref to track component mount state
  const [debounceQuery] = useDebounce(query , 500)

  useEffect(() => {
    isMounted.current = true; // Set ref to true when the component mounts

    return () => {
      isMounted.current = false; // Cleanup: Mark component as unmounted
    };
  }, []);

  useEffect(() => {
    if(!searchQuery){
      setQuery('');
    }
  }, [searchQuery])
  
  useEffect(() => {
    const fetchFiles = async () => {
      if(debounceQuery.length === 0) {
        setOpen(false);
        setResult([]);
        return router.push(path.replace(searchParams.toString(), ""));
      }
      const files = await getFiles({types: [], searchText: query});
      if(isMounted.current){
        setResult(files.documents);
        setOpen(true);
      }
    };
    fetchFiles();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debounceQuery])
  
  const handleClickItem = (file: Models.Document) => {
    setOpen(false); 
    setResult([]);
    router.push(`${(file.type === 'video' || file.type === 'audio') ? 'media' : file.type + 's' }?query=${query}`);
  } 
  return (
    <div className='search'>
      <div className='search-input-wrapper'>
        <Image 
          src="/assets/icons/search.svg"
          alt='Search'
          width={24}
          height={24} />
        <Input 
          value={query} 
          placeholder='Search...' 
          className='search-input w-2'
          onChange={(e)=>setQuery(e.target.value)} />
        { open && (
          <ul className='search-result'>
            {result.length > 0 ? (
              result.map( (file)=>
                <li key={file.$id} className='flex items-center justify-between' onClick={()=>handleClickItem(file)}>
                  <div className='flex cursor-pointer items-center gap-4'>
                    <Thumbnail type={file.type} extension={file.extension} url={file.url} className='size-9 min-w-9'/>
                    <p className='subtitle-2 line-clamp-2 text-light-100'>{file.name.length > 24 ? file.name.slice(0,24).concat("...").concat(file.extension) : file.name}</p>
                  </div>
                  <FormattedDateTime date={file.$createdAt} className='caption text-light-200' />
                </li> )
              ): (
              <p className='empty-result'>No files found</p>
            )}
          </ul>
        )}
      </div>
    </div>
  )
}

export default Search