import {useState,useEffect} from "react"
import styles from "@/components/main.module.css";

type SearchProps =
{
    value:string,
    setValue:(value:string)=>void,
    className?: string
}
export default function SearchBar({value,setValue,className}:SearchProps)
{

    return(
        <input type="search"
         value={value}
         onChange={(e)=>setValue(e.target.value)}
         className={className}/>
    )
}