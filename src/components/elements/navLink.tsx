
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
    <a href={src} color={isActive ? "cyan" : ""} onClick={()=>onClick}>
        {label}
    </a>
 )
}