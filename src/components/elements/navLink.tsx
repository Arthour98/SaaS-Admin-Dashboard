import Link from "next/link"
export interface NavLinkProps 
{
src:string,
label:string,
isActive?:boolean,
onClick?: (e:Event)=>void
}

export const NavLink=({src,label,isActive,onClick}:NavLinkProps)=>
{
 return(
    <Link href={src} color={isActive ? "cyan" : ""} onClick={()=>onClick} prefetch transitionTypes={["slide-in"]}>
        {label}
    </Link>
 )
}