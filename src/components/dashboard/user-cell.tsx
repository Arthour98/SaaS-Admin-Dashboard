import { useState } from "react";
import CustomButton from "../elements/customButton";
import { UserCellProps } from "./users-layout";
import styles from "@/components/main.module.css";
import { UserProps } from "@/app/dashboard/page";

export default function  UserCell({user,isOwner,currUser}:{user:UserCellProps,isOwner:boolean,currUser:UserProps})
{
    const [isLoadingDelete,setIsLoadingDelete] = useState(false);
    
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
                <div className="flex">
                    <CustomButton element="button" content="delete" className={styles.deleteButton} isLoading={isLoadingDelete}/>
                </div>
                :
                null
                }
            </div>
        </div>
    )
}