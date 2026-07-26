import {useState,useEffect} from "react"
import styles from "@/components/main.module.css";
import CustomerCol from "./customer-col";
import { CustomerProps } from "@/app/dashboard/customers/customersClient";
import { OrgProps, UserProps } from "@/app/dashboard/page";


export default function CustomerLayout(
{current_layout,customers,user,organization}:
{
current_layout:boolean,
customers:CustomerProps[],
user:UserProps,
organization:OrgProps})
{
  
if(!current_layout)
{
    return null;
}

return(
<div className={styles.customersLayout}>
    <div className={styles.customersHeader}>
        <div className={styles.col2}>
            <p>Name</p>
        </div>
        <div className={styles.col2}>
            <p>Number</p>
        </div>
        <div className={styles.col2}>
            <p>Created at</p>
        </div>
        <div className={styles.col4}>
            <p>Origin</p>
        </div>
    </div>
    <div className={styles.customersContent}>
        {
        customers?.map((cus:CustomerProps)=>
        {
            return(<CustomerCol key={cus.id} customer={cus}/>)
        })
        }
    </div>
</div>
)
}

