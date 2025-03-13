'use client'
import { usePathname, useRouter } from "next/navigation"
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue, } from "./ui/select"
import { sortTypes } from "../constants";
import { useTransition } from "react";

const Sort = () => {
  const path =  usePathname();
  const router = useRouter();
  const [isPending, startTransition] = useTransition(); // Smooth async updates

  const handleSort = (value: string) => {
    startTransition(() => {
      router.replace(`${path}?sort=${value}`); // Faster than push()
    });
  }
  return (
    <Select onValueChange={handleSort} defaultValue={sortTypes[0].value}>
      <SelectTrigger className="sort-select">
        <SelectValue placeholder={sortTypes[0].value} />
      </SelectTrigger>
      <SelectContent className="sort-select-content">
        {sortTypes.map((sort)=> (
          <SelectItem key={sort.label} value={sort.value} className="shad-select-item">{sort.label}</SelectItem>
        ))}
      </SelectContent>
  </Select>

  )
}

export default Sort