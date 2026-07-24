import {useState,useEffect} from "react"
import styles from "@/components/main.module.css";

export interface CustomersLayoutProps 
{
    current_layout: boolean;
    info : CustomersProps
}

 type CustomersProps = 
{
    id :number
    name:string | null,
    customer_stripe_id? :string |null,
    organization:string | null,
    created_at : string | null,
    phone_number?:string
}

export default function InfoLayout(
    {current_layout,info}:CustomersLayoutProps)
{
    if(!current_layout)
    {
        return null;
    }

   
    


    return(
    <div className={styles.customersLayout}>

    </div>
    )
}

