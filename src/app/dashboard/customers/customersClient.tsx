'use client'
import {useEffect,useState} from "react";
import styles from "@/components/main.module.css";
import { useRouter } from "next/navigation";
import DashBoardTabs from "@/components/dashboard/dashboard-tabs";
import SearchBar from "@/components/elements/search-bar";
import CustomerLayout from "@/components/customers/customers-layout";

export interface CustomerProps
{
id:number,
customer_stripe_id?:string,
name:string,
phone_number?:string,
created_at: string,
organization_id:number,
origin:string
}

export default function CustomersClient(
    {customers}:
    {customers:CustomerProps[]}
)
{

    const router = useRouter();
    const dashBoardTabs = ["Customers","Add customer"]  // tabs array
    const [currTab,setCurrentTab] = useState("Customers") // selected tab
    
    
    const [searchInput,setSearchInput]= useState("")
    
    const changeTab =(tab:string) =>
    {
        setCurrentTab(tab);
    }
    return(
        <div className={styles["dashboard-content"]}>
            <div className={styles.filterRow}>
                <div className={styles.filterCol}>
                    <DashBoardTabs tabs={dashBoardTabs} tab={currTab} setTab={changeTab}/>
                </div>
                <div className={styles.searchCol}>
                    <SearchBar
                    value={searchInput}
                    setValue={setSearchInput}
                    className={styles.searchBar}
                    />
                </div>
            </div>
            <div className={styles["content-main"]}>
                < CustomerLayout
                 customers={customers}
                 current_layout={currTab==="Customers"}
                 />
            </div>
        </div>
    )
}