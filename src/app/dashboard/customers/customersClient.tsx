'use client'
import {useEffect,useState} from "react";
import styles from "@/components/main.module.css";
import { useRouter } from "next/navigation";
import DashBoardTabs from "@/components/dashboard/dashboard-tabs";
import SearchBar from "@/components/elements/search-bar";
import CustomerLayout from "@/components/customers/customers-layout";
import AddCustomerLayout from "@/components/customers/create-customer-layout";
import { UserProps } from "../page";
import { OrgProps } from "../page";
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
{customers,user,organization}:  
{customers:CustomerProps[],
user:UserProps,
organization:OrgProps}
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
                    currentTab={currTab}
                    value={searchInput}
                    setValue={setSearchInput}
                    className={styles.searchBar}
                    />
                </div>
            </div>
            <div className={styles["content-main"]}>
                < CustomerLayout
                 customers={customers}
                 organization={organization}
                 user={user}
                 current_layout={currTab==="Customers"}
                 />
                 <AddCustomerLayout
                 customers={customers}
                 organization={organization}
                 user={user}
                 current_layout={currTab ==="Add customer"}
                 />
            </div>
        </div>
    )
}