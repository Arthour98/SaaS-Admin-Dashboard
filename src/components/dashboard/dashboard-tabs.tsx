"use client";
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
                tabs?.map((t,index)=> 
                    (<div key={index} onClick={()=>setTab(t)}
                     className={tab===t? styles.tabCell.concat(" bg-cyan-400!") : styles.tabCell}>
                        <p>{t}</p>
                    </div>)
                
                )
            }
        </>
    )
}