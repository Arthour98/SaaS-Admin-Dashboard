import { NavLink } from "../elements/navLink"
import { NavLinkProps } from "../elements/navLink"
import { usePathname } from "next/navigation"

export default function Header({}) {

const path = usePathname();

const handleSettingClick = (e:Event)=>
{
e.preventDefault();
let dropdown = document.querySelector('.dropdown-settings');
if(!dropdown?.classList.contains("visilble"))
{
dropdown?.classList.add("visible")
}
else
{
    dropdown.classList.remove("visible");
}
}
   
return(
<header>
    <nav>
        <div className="navWrapper">
            <NavLink src="/" label="Home" isActive={path ==="/"}/>
            <NavLink  src="/dashboard" label="Dashboard" isActive={path ==="/dashboard"}/>
            <NavLink src="/customers" label="Customers" isActive={path ==="/customers"}/>
            <NavLink src="/order" label="Orders" isActive={path ==="/orders"}/>
            <NavLink src="/integrations" label="Integrations" isActive={path ==="/integrations"}/>
            <NavLink src="/tickets" label="Tickets" isActive={path ==="/tickets"}/>
            <div className="settingsWrapper">
            <NavLink src="/settings" label="Settings" onClick={handleSettingClick} isActive={path.startsWith("/settings")}/>
                <div className="dropdown-settings">
                    <NavLink src="/settings/account" label="Account" isActive={path === "/settings/account"}/>
                    <NavLink src="/settings/billing" label="Billing" isActive={path === "/settings/billing"}/>
                    <NavLink src="/settings/sign-out" label="Sign Out"/>
                </div>
            </div>
        </div>
    </nav>
</header>)
}