
import styles from "@/components/main.module.css";
import UserCell from "./user-cell";
import { OrgProps, UserProps } from "@/app/dashboard/page";

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
    owner_id : number
    currUser: UserProps
    openPerms:(user_id:number)=>void,
    triggerRefresh:(data:string)=>void,
    org:OrgProps
}

export default function UsersLayout({
    users,
    current_layout,
    owner_id,
    currUser,
    openPerms,
    triggerRefresh,
    org
    }:UsersLayoutProps)
{
     if(!current_layout)
    {
        return null;
    }
    
    const userArr = users?.map((u:object)=>u); //Org users mapping

    const triggerOpen=(user_id:number)=>
    {
        openPerms(user_id)
    }
    
    
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
                        triggerRefresh={triggerRefresh}
                        owner_id={owner_id}
                        currUser={currUser}
                        openPermiModal={triggerOpen}
                        org={org}
                        />
                       )) 
                    }
                    </div>
                )
            }
        
        </div>
    )
}