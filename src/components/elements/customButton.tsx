"use client"
import { useState,useEffect } from "react";
import styles from "@/components/main.module.css";



export interface ButtonProps 
{
element: string,
className? :string,
isLoading? : boolean
content: string,
onClick? : (e: React.MouseEvent<HTMLButtonElement>)=> void 
name?:string
}

const Loader = ({})=>
{
    return (
        <div className={styles.loader}>

        </div>
    )
}
export default function CustomButton(
    {
    element,
    className,
    isLoading,
    content,
    onClick,
    name
    }:ButtonProps)
{
    if(element === "button")
    {
        return(
            <button 
            className={className}
            name={name}
            onClick={onClick}
            >
                {
                !isLoading ?
                content :
                <Loader/>
                }
            </button>
        )
    }
    else if(element == "input")
    {
        return(<button 
        className={className} 
        type="submit"
        name={name}
        onClick={onClick}>
            {
                !isLoading ?
                content :
                <Loader/>
            }
        </button>)
    }
}