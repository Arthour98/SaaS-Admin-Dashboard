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
    organization:string | null,
    organization_members: number |null,
    position:string | null ,
    joined : string | null,
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
            info_keys?.map((key,index) =>
            {
                return(
                <div key={index}  className={styles.infoCell}>
                    <div className={"flex-1/2 font-semibold"}>
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


