import {useState,useEffect} from "react"
import styles from "@/components/main.module.css";
import { CustomersLayoutProps } from "./customers-layout";


export default function InfoLayout(
    {current_layout}:CustomersLayoutProps)
{
    if(!current_layout)
    {
        return null;
    }

   
    


    return(
    <div className={styles.createCustomersLayout}>
  
    </div>
    )
}
