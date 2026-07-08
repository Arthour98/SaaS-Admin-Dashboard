import {useState,useEffect} from "react"
import styles from "@/components/main.module.css";

export type InfoLayoutProps =
{
    current_layout: boolean;
    info : InfoProps
}

type InfoProps = 
{
    username:string,
    organization:string,
    organization_members: number,
    position:string | null ,
    joined : string,
}

export default function InfoLayout(
    {current_layout,info}:InfoLayoutProps)
{
    if(!current_layout)
    {
        return null;
    }

    const info_keys = Object.keys(info) as (keyof InfoProps)[];;
    


    return(
    <div className={styles.infoLayout}>
        {
            info_keys?.map(key =>
            {
                return(
                <div className={styles.infoCell}>
                    <div className={"flex-1/2"}>
                        <p>{key}</p>
                    </div>
                    <div className={"flex-1/2"}>
                        <p>{info[key]}</p>
                    </div>
                </div>
                )
            })
        }
    </div>
    )
}


