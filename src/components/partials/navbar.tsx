"use client";
import { NavLink } from "../elements/navLink";
import { usePathname } from "next/navigation";
import { MouseEvent } from "react";
export default function NavBar({}){

    const path = usePathname();
    

    const handleSettingClick = (e:MouseEvent)=>
    {
        let dropdown = document?.querySelector('.dropdown-settings ');
        e.preventDefault();
        
        if(!dropdown?.classList.contains("visible"))
        {
            dropdown?.classList.add("visible")
        }
        else
        {
            dropdown.classList.remove("visible");
        }
    }
    return(
    <div className="navWrapper">
        <NavLink  src="/dashboard" label="Dashboard" isActive={path ==="/dashboard"}/>
        <NavLink src="/customers" label="Customers" isActive={path ==="/customers"}/>
        <NavLink src="/order" label="Orders" isActive={path ==="/orders"}/>
        <NavLink src="/integrations" label="Integrations" isActive={path ==="/integrations"}/>
        <NavLink src="/tickets" label="Tickets" isActive={path ==="/tickets"}/>
        <div className="settingsWrapper">
        <NavLink src="/settings" label="Settings" onClick={handleSettingClick} isActive={path?.startsWith("/settings")}/>
            <div className="dropdown-settings">
                <NavLink src="/settings/account" label="Account" isActive={path === "/settings/account"}/>
                <NavLink src="/settings/billing" label="Billing" isActive={path === "/settings/billing"}/>
                <NavLink src="/settings/sign-out" label="Sign Out"/>
            </div>
        </div>
    </div>
)
}