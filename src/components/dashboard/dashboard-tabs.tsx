import {useState,useEffect} from "react"
import styles from "@/components/main.module.css";

export type DashBoardTabsProps=
{
    tabs: string[],
    tab : {}
    setTab : (key:string)=> void
}

export default function DashBoardTabs({tabs,tab,setTab}:DashBoardTabsProps)
{

    return(
        <>
            {
                tabs?.map(t=>
                {
                    <div className={styles.tabCell}>
                        <p>t</p>
                    </div>
                }
                )
            }
        </>
    )
}