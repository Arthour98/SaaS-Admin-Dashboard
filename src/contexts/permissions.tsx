import { useQuery } from "@/lib/use-query";
import { createContext,useContext,useState,useEffect } from "react";

type PermContextType = {
    usersPermissions?: Set<string>,
    role?: any,
    isPermited?:(perm:string)=>boolean
};

const permContext = createContext<PermContextType | null>(null);

export default function PermProvider(
    {children}
    :
    {
        children:React.ReactNode
    })
{
const [usersPermissions,setUserPermissions] =  useState<Set<string>>(new Set());
const [role,setRole] = useState(null);
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
 getUserPermissions();
},[])

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
        isPermited
    }}>
        {children}
    </permContext.Provider>
)

}

export const usePerms =()=>
{
    if(!permContext)
    {
        return;
    }
    return useContext(permContext);
}