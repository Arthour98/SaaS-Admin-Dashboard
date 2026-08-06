import { useState } from "react";
import CustomButton from "../elements/customButton";
import { UserCellProps } from "./users-layout";
import styles from "@/components/main.module.css";
import { OrgProps, UserProps } from "@/app/dashboard/page";
import { usePerms } from "@/contexts/permissions";
import { useQuery } from "@/lib/use-query";
import { useToast } from "@/db/hooks/use-toast";

export default function  UserCell(
    {
    user,owner_id,
    currUser,
    openPermiModal,
    triggerRefresh,
    org
    }
    :
    {
    user:UserCellProps,
    owner_id:number,
    currUser:UserProps,
    openPermiModal:(user_id:number)=>void,
    triggerRefresh:(data:string)=>void,
    org:OrgProps
})
{
    const {isPermited} = usePerms();
    const [isLoadingDelete,setIsLoadingDelete] = useState(false);
    
    const openPermissionModal = (user_id:number)=>
    {
        openPermiModal(user_id);
    }

    const deleteUser = async(e:React.MouseEvent)=>
    {
        e.preventDefault();
        setIsLoadingDelete(true);
        try
        {
            const data=
            {
            user_id:currUser.id,
            user_name:currUser.name,
            deleted_user_id :user.id,
            deleted_user_name:user.name,
            organization_id:org.organization_id
            }
            const res= await useQuery("organizations/kick",{method:"delete",body:data});
            if(res?.data.status==="success")
            {
                setIsLoadingDelete(false);
                useToast({type:"success",message:"Member successfully deleted!"})
                triggerRefresh(res?.data.status)
            }
            else
            {
                setIsLoadingDelete(false);
                useToast({type:"error",message:"Error deleting member!"})
            }   
        }
        catch(e)
        {
            setIsLoadingDelete(false);
            useToast({type:"error",message:"Error deleting member!"})
        }
    }

    return (
        <div className={styles.userRow}>
            <div className={styles.userNameCol}>
                <p>{user.name}</p>
            </div>
            <div className={styles.userPositionCol}>
                <p>{user.position}</p>
            </div>
            <div className={styles.userJoinDateCol}>
                <p>{new Date(user.joined_at).toLocaleDateString()}</p>
            </div>
            <div className={styles.userActionCol}>
                <div className="flex gap-2">
                    {
                        isPermited("delete_users") && 
                        (currUser.id!==user.id && user.id!==owner_id)
                        ?
                        (
                            <CustomButton 
                            element="button" 
                            content="Delete" 
                            className={styles.deleteButton} 
                            isLoading={isLoadingDelete}
                            onClick={(e)=>deleteUser(e)}
                            />
                        ):null
                    }
                     {   
                        isPermited("assign_permissions") && 
                        (currUser.id!==user.id && user.id!==owner_id)?
                        (
                        <CustomButton 
                        element="button" 
                        content="Permissions" 
                        className={styles.editButton} 
                        onClick={()=>openPermissionModal(user.id)} />
                        ):null
                    } 
                </div>
            </div>
        </div>
    )
}