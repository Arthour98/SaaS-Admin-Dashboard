import styles from "@/components/main.module.css";
import permissions from "@/json/permisions.json";
import CustomButton from "../elements/customButton";
import { useEffect,useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { UserCellProps } from "../dashboard/users-layout";
import { useQuery } from "@/lib/use-query";
import { useToast } from "@/hooks/use-toast";

type ModalProps = 
{
    open:boolean,
    user: UserCellProps |null,
    org_id:number
    closeModal:()=>void
}
export default function PermModal({open,user,org_id,closeModal}:ModalProps)
{
    const allPermissions = permissions?.permissions;
    const  userPermissions = user?.permissions;
    const [permissionsArr,setPermissionsArr] = useState<null | Map<string,boolean>>(null);

useEffect(()=>
{
    if(userPermissions == undefined)
    {
        return;
    }
    console.log("userPerms",userPermissions)
    console.log("allPerm:",allPermissions)
    const  unifiedPermissions = new Map();
    for(let i = 0 ; i<allPermissions.length; i++)
    {
        unifiedPermissions.set(allPermissions[i],true)
    }
    for(let i = 0 ; i<allPermissions.length; i++)
    {
        const currPer = userPermissions[i] as string;
        const checked : boolean = allPermissions?.includes(currPer);
        if(checked)
        {
            unifiedPermissions.set(allPermissions[i],true)
        }
        else
        {
            unifiedPermissions.set(allPermissions[i],false)
        }
        
    }
    setPermissionsArr(unifiedPermissions);
},[allPermissions,userPermissions,open])

useEffect(()=>
{
console.log("permisions:",permissionsArr);
},[permissionsArr])

const roles = ["team_member","team_leader"];
type Role = "team_member" | "team_leader";
const [selRole,setSelRole] = useState<null|Role>(null)

const handleChangePerms = (key:string,value:boolean)=>
{
    setPermissionsArr(prev => {
    if (!prev) return null;

    const newPerms = new Map(prev);
    newPerms.set(key, !value);

    return newPerms;
});
}

const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>)=>{
    setSelRole(e?.target.value as Role);
}

// useEffect(()=>
// {
//     if(!selRole )return;
//     if(userPermissions == undefined)
//     {
//         return;
//     }

//     const standarPerms = new Map();
//     const rolesPermissions  =  permissions[`${selRole}`];
//     for(let i = 0 ; i<allPermissions.length; i++)
//     {
//         const checked : boolean = allPermissions?.includes(rolesPermissions[i]);
//         if(checked)
//         {
//             standarPerms.set(allPermissions[i],true)
//         }
//         else
//         {
//             standarPerms.set(allPermissions[i],false)
//         }
        
//     }
//     let filteredPermissions = permissionsArr?.entries()
//     console.log("filtered:",filteredPermissions)
//     setPermissionsArr(standarPerms);
// },[selRole,open,userPermissions])

const [isLoadingSubmit,setIsLoadingSubmit] = useState(false);

const submitPermissions = async()=>
{
    setIsLoadingSubmit(true);
    try
    {
        let filteredPermissions:any = [];
        permissionsArr?.forEach((value,key)=>
        {
            if(value===true)
            {
                filteredPermissions.push(key);
            }
        })
        
        const data = 
        {
            user_id:user?.id,
            permissions:filteredPermissions,
            role:selRole,
            organization_id:org_id
        }
        const res = await useQuery("dashboard/permissions",{method:"put",body:data});
        if(res.data.status==="success")
        {
            setIsLoadingSubmit(false);
            useToast({type:"success",message:"Role and permissions updated"})
        }
        else
        {
            setIsLoadingSubmit(false);
            useToast({type:"error",message:"Error updating role and permissions "})
        }
    }
    catch(e)
    {
        console.error(e);
        setIsLoadingSubmit(false);
        useToast({type:"error",message:"Error updating role and permissions "})
    }
}

if(!open)
{
    return null;
}

    

return(
<div className={styles.perModal}>
    <FontAwesomeIcon icon={faX} width={12} className={styles.closeIcon} onClick={()=>closeModal()}/>
    <div className={styles.perModalContent}>
        <div className={styles.roleRow}>
            <label className="font-semibold">Assign role</label>
            <select className={styles.permSelect} onChange={(e)=>handleRoleChange(e)}>
                {
                    roles.map((role,index)=>
                    (
                        <option key={index} value={role}>{role}</option>
                    )
                    )
                }
            </select>
        </div>
        <div className={styles.permissionRow}>
            {
                Array.from(permissionsArr?.entries() ?? []).map(([key, value]) =>
            (
                <div className={styles.permCol} key={key}>
                    <label className={styles.permLabel}>{key}:</label>
                    <input
                    type="checkbox"
                    value={value.toString()}
                    onChange={()=>handleChangePerms(key,value)}
                    checked={value}
                    />
                </div>
            ))
            }
        </div>
        <div className={styles.submitPermsCol}>
            <CustomButton 
            className={styles.submitButton}
            element="button"
            content="Save"
            onClick={submitPermissions}
            isLoading={isLoadingSubmit}
            />
        </div>
    </div>
</div>
)
}