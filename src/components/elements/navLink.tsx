"use client";
import Link from "next/link"
import { useState } from "react";
import type { MouseEvent } from "react";
export interface NavLinkProps 
{
src:string,
label:string,
isActive?:boolean,
onClick?: (e:MouseEvent)=>void,
}

export const NavLink=({src,label,isActive,onClick}:NavLinkProps)=>
{
const [isHovering,setIsHovering]= useState(false);

 return(
    <Link href={src} className={
        isActive ? "text-cyan-400" : "text-gray-400"
    }
        onClick={(e)=>onClick?.(e)}
        prefetch
        transitionTypes={["slide-in"]}
        onMouseOver={()=>setIsHovering(true)}
        onMouseLeave={()=>setIsHovering(false)}
        style={{color:isHovering ? "#22d3ee" : undefined}}
        >
        {label}
    </Link>
 )
}