'use client'
import {useEffect,useState} from "react";
import styles from "@/components/main.module.css";

export default function DashBoardClient({})
{

    return(
        <div className={styles["dashboard-content"]}>
            <div className={styles.filterRow}>
                <div className="filterCol">

                </div>
                <div className={styles.searchCol}>

                </div>
            </div>
            <div className={styles["content-main"]}>
                
            </div>
        </div>
    )
}