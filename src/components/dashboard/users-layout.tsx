import {useState,useEffect,useCallback} from "react"
import styles from "@/components/main.module.css";
import UserCell from "./user-cell";
import { UserProps } from "@/app/dashboard/page";
import PermModal from "../modals/permission-modal";

export type UserCellProps=
{
    id:number,
    name:string,
    position:string,
    joined_at:string,
    permissions: string[]
}
export type UsersLayoutProps =
{
    users:  any | null,
    current_layout:boolean
    isOwner : boolean
    currUser: UserProps
}

export default function UsersLayout({users,current_layout,isOwner,currUser}:UsersLayoutProps)
{
     if(!current_layout)
    {
        return null;
    }
    
    const userArr = users?.users.map((u:object)=>u); //Org users mapping

    const [openPermissionModal,setOpenPermissionModal] = useState(false);
    const [userPerms,setUserPerms] = useState(null);

    const handleOpenPermiModal = useCallback((user_id:number)=>
    {
        if(user_id)
        {
            const selected_user = userArr?.find((u:UserCellProps) => u?.id ===user_id)
            if(selected_user)
            {
                setUserPerms(selected_user);
                setOpenPermissionModal(true);
            }
            
        }
    },[userPerms,openPermissionModal]);


    const handleClosePermModal = useCallback(()=>
    {
        setOpenPermissionModal(false);
    },[openPermissionModal])
    
    return(
        <div className={styles.usersLayout}>
            {
                !users ?
                (
                    <div className={styles.notFound}>
                        <p>Not users Found</p>
                    </div>
                )
                :
                (
                    <div className={styles.usersContainer}>
                        <div className={styles.tableHeader}>
                            <div className={styles.Tname}>
                                <h3>Name</h3>
                            </div>
                            <div className={styles.Tpos}>
                                <h3>Position</h3>
                            </div>
                            <div className={styles.Tdate}>
                                <h3>Join Date</h3>
                            </div>
                            <div className={styles.Tactions}>
                                <h3>Actions</h3>
                            </div>
                        </div>
                       {userArr?.map((user:UserCellProps)=>
                       (
                        <UserCell 
                        key={user.id}
                        user={user}
                        isOwner={isOwner}
                        currUser={currUser}
                        openPermiModal={handleOpenPermiModal}
                        />
                       )) 
                    }
                    </div>
                )
            }
        <PermModal user={userPerms} open={openPermissionModal} closeModal={handleClosePermModal}/>
        </div>
    )
}