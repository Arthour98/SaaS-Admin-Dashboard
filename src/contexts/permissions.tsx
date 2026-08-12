import { useQuery } from "@/lib/use-query";
import { usePathname } from "next/navigation";
import { createContext,useContext,useState,useEffect, useMemo } from "react";

type PermContextType = {
    usersPermissions?: Set<string>,
    isPermited:(perm:string)=>boolean,
    role?: any,
    useCustomTrigger : ()=>void
};

const permContext = createContext<PermContextType | null>(null);


export default function PermProvider(
    {children}
    :
    {
        children:React.ReactNode
    })
{
const path = usePathname();

const session_routes = useMemo(()=>
{
return path.startsWith('/dashboard');
},[path]); 



const [usersPermissions,setUserPermissions] =  useState<Set<string>>(new Set());
const [role,setRole] = useState(null);
const [customTrigger,setCustomTrigger]=useState(false);

const useCustomTrigger = ()=>
{
    setCustomTrigger(true);
} // function to trigger the dependancy that will trigger rerender on org creation.
//so user can make actions instant and not refresh the page to trigger fetch permmissions.

const getUserPermissions = async()=>
{
    try{
        const user = await useQuery("auth/me",{method:"get"});
        const res = await useQuery("permissions/get",{method:"get",
            params:{
                "user_id":user?.user.id,
            }
        })
        const perms = new Set<string>(res.data.permissions);
        const _role = res.data.role;
        setUserPermissions(perms);
        setRole(_role);
    }
    catch(e)
    {
        console.error(e);
    }
}
useEffect(()=>
{
if(!session_routes)
{
    return;
}
 getUserPermissions();
},[session_routes,customTrigger])

const isPermited = (perm:string) =>
{
const permit = usersPermissions.has(perm);
if(permit)
{
    return true;
}
else
{
    return false;
}
}

return(
    <permContext.Provider value=
    {{
        usersPermissions,
        role,
        isPermited,
        useCustomTrigger
    }}>
        {children}
    </permContext.Provider>
)

}
export const usePerms = () => {
    const context = useContext(permContext);
    if (context === null) {
        throw new Error("Permissions are undefined");
    }

    return context;
};