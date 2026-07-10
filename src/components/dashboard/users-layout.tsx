import {useState,useEffect} from "react"
import styles from "@/components/main.module.css";

export type UsersLayoutProps =
{
    users: any[] | null,
    current_layout:boolean
}

export default function UsersLayout({users,current_layout}:UsersLayoutProps)
{
 
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
                    </div>
                )
            }
        </div>
    )
}