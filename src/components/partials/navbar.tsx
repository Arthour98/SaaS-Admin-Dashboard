"use client";
import { NavLink } from "../elements/navLink";
import { usePathname } from "next/navigation";
import { MouseEvent, useEffect } from "react";
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

    useEffect(()=>
    {
        let dropdown = document?.querySelector('.dropdown-settings ');
        if(path.startsWith("/dashboard/settings"))
        {
            dropdown?.classList.add("visible")
        }
    },[]);

    return(
    <div className="navWrapper">
        <NavLink prefetch src="/dashboard" label="Dashboard" isActive={path ==="/dashboard"}/>
        <NavLink prefetch src="/dashboard/customers" label="Customers" isActive={path ==="/dashboard/customers"}/>
        <NavLink prefetch src="/dashboard//orders" label="Orders" isActive={path ==="/dashboard/orders"}/>
        <NavLink prefetch src="/dashboard/integrations" label="Integrations" isActive={path ==="/dashboard/integrations"}/>
        <NavLink prefetch src="/dashboard/tickets" label="Tickets" isActive={path.startsWith("/dashboard/tickets")}/>
        <div className="settingsWrapper">
        <NavLink src="/dashboard/settings" label="Settings" onClick={handleSettingClick} isActive={path?.startsWith("/dashboard/settings")}/>
            <div className="dropdown-settings">
                <NavLink prefetch src="/dashboard/settings/account" label="Account" isActive={path === "/dashboard/settings/account"}/>
                <NavLink src="/dashboard/settings/billing" label="Billing" isActive={path === "/dashboard/settings/billing"}/>
                <NavLink src="/api/auth/logout" label="Sign Out"/>
            </div>
        </div>
    </div>
)
}