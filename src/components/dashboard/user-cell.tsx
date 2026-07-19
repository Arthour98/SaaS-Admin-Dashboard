import { useState } from "react";
import CustomButton from "../elements/customButton";
import { UserCellProps } from "./users-layout";
import styles from "@/components/main.module.css";
import { UserProps } from "@/app/dashboard/page";

export default function  UserCell({user,isOwner,currUser,openPermiModal}:
    {user:UserCellProps,isOwner:boolean,currUser:UserProps,openPermiModal:(user_id:number)=>void})
{
    const [isLoadingDelete,setIsLoadingDelete] = useState(false);
    
    const openPermissionModal = (user_id:number)=>
    {
        openPermiModal(user_id);
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
                <p>{new Date(user.joined_at).toISOString()}</p>
            </div>
            <div className={styles.userActionCol}>
                { isOwner && currUser.id !== user.id ?
                <div className="flex gap-2">
                    <CustomButton element="button" content="Delete" className={styles.deleteButton} isLoading={isLoadingDelete}/>
                    <CustomButton element="button" content="Permissions" className={styles.editButton} onClick={()=>openPermissionModal(user.id)} />
                </div>
                :
                null
                }
            </div>
        </div>
    )
}