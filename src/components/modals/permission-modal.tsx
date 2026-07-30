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
    triggerRefresh:(data:string)=>void
}
export default function PermModal({open,user,org_id,closeModal,triggerRefresh}:ModalProps)
{
    const allPermissions = permissions?.permissions;
    const  userPermissions = user?.permissions;
    const [permissionsArr,setPermissionsArr] = useState({});

useEffect(()=>
{
    if(userPermissions == undefined)
    {
        return;
    }
    const perms:any ={}
    for(let i = 0 ; i<allPermissions.length; i++)
    {
        const checked = userPermissions.includes(allPermissions[i])
        if(checked)
        {
        perms[allPermissions[i]]=true;
        }
        else
        {
         perms[allPermissions[i]]=false;
        }
    }
    setPermissionsArr(perms);
},[allPermissions,userPermissions,open]) // initialization effect

const roles = ["team_member","team_leader"];
type Role = "team_member" | "team_leader";
const [selRole,setSelRole] = useState<null|Role>(user?.position as Role)

const handleChangePerms = (key:string,value:boolean)=>
{
    setPermissionsArr(prev => {
    if (!prev) return null;
    const newPerms:any = {...prev};
    newPerms[key]=!value;
    return newPerms;
});
}

const handleRoleChange = (e: React.ChangeEvent<HTMLSelectElement>)=>{
    setSelRole(e?.target.value as Role);
}

useEffect(()=>
{
    if(!selRole )return;
    if(userPermissions == undefined || allPermissions==undefined)
    {
        return;
    }
    const standarPerms :any = {};
    const rolesPermissions :any  = permissions[`${selRole}`];
    for(let i = 0 ; i<allPermissions.length; i++)
    {
        const checked = rolesPermissions.includes(allPermissions[i]) 
        || userPermissions.includes(allPermissions[i]);
        if(checked)
        {
        standarPerms[allPermissions[i]]=true;
        }
        else
        {
        standarPerms[allPermissions[i]]=false;
        }
        
    }
    setPermissionsArr(standarPerms);
},[selRole,open,userPermissions,allPermissions]) 

const [isLoadingSubmit,setIsLoadingSubmit] = useState(false);

const submitPermissions = async()=>
{
    setIsLoadingSubmit(true);
    try
    {
        let filteredPermissions:any = Array.from(Object.entries(permissionsArr))
        .filter(([key,value])=>value===true).map(p=>p[0]);

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
            triggerRefresh(res?.data?.status);
            closeModal();
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
            <select className={styles.permSelect} value={selRole as Role} onChange={(e)=>handleRoleChange(e)}>
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
                Object.entries(permissionsArr).map(([key,value]) =>
            (
                <div className={styles.permCol} key={key}>
                    <label className={styles.permLabel}>{key}:</label>
                    <input
                    type="checkbox"
                    value={key?.toString()}
                    onChange={()=>handleChangePerms(key,value as boolean)}
                    checked={value as boolean}
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