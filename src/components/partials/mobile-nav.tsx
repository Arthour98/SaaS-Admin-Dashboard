
"use client";
import { faBars, faClose } from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useState,useEffect,MouseEvent } from "react";
import { usePathname } from "next/navigation";
import { NavLink } from "../elements/navLink";

export default function MobileNav({})
{
const path = usePathname();
const [openMobile,setOpenMobile] = useState(false);

const openMobileNav = ()=>
{
    setOpenMobile(true);
}

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

    const handleCloseNav = ()=>
    {
        setOpenMobile(false)
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
<div className="mobileNavWrapper">
    <div
    className="navCol">
    <FontAwesomeIcon 
    icon={faBars}
    className="navIcon"
    onClick={()=>openMobileNav()}
    />
    </div>
    {
    openMobile ? (
        <div className="mobileNavContainer">
            <div className="mobileNav">
                <NavLink  src="/dashboard" label="Dashboard" isActive={path ==="/dashboard"}/>
                <NavLink src="/dashboard/customers" label="Customers" isActive={path ==="/dashboard/customers"}/>
                <NavLink src="/dashboard//orders" label="Orders" isActive={path ==="/dashboard/orders"}/>
                <NavLink src="/dashboard/integrations" label="Integrations" isActive={path ==="/dashboard/integrations"}/>
                <NavLink src="/dashboard/tickets" label="Tickets" isActive={path.startsWith("/dashboard/tickets")}/>
                <div className="settingsWrapper">
                <NavLink src="/dashboard/settings" label="Settings" onClick={handleSettingClick} isActive={path?.startsWith("/dashboard/settings")}/>
                    <div className="dropdown-settings">
                        <NavLink src="/dashboard/settings/account" label="Account" isActive={path === "/dashboard/settings/account"}/>
                        <NavLink src="/dashboard/settings/billing" label="Billing" isActive={path === "/dashboard/settings/billing"}/>
                        <NavLink src="/api/auth/logout" label="Sign Out"/>
                    </div>
                </div>
            </div>
            <FontAwesomeIcon
            icon={faClose}
            className="closeNavIcon"
            onClick={()=>handleCloseNav()}
            />
        </div>
    ):
    null
    }
</div>
)
}