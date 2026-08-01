'use client'
import {useEffect,useState} from "react";
import styles from "@/components/main.module.css";
import DashBoardTabs from "@/components/dashboard/dashboard-tabs";
import SearchBar from "@/components/elements/search-bar";
import TicketsLayout from "@/components/tickets/tickets-layout";
import CreateTicketsLayout from "@/components/tickets/create-tickets-layout";
import { UserProps } from "../page";
import { useRouter } from "next/navigation";

export interface TicketsProps
{
    id:number,
    organization_id:number,
    title?:string | null,
    content?:string | null
}
export default function TicketsClient(
    {tickets,user,organization_id}:
    {
    tickets:TicketsProps[],
    user:UserProps,
    organization_id:number
    }
){
    const router = useRouter();
    const [searchInput,setSearchInput] =useState("");
    const ticketsTabs =["Tickets","Create tickets"];
    const [currTab,setCurrentTab]= useState("Tickets");

    const changeTab = (tab:string)=>
    {
        setCurrentTab(tab);
    }

    const triggerRefresh = (status:string)=>
    {
        router.refresh();
    }
    
    return(
        <div className={styles["dashboard-content"]}>
            <div className={styles.filterRow}>
                <div className={styles.filterCol}>
                     <DashBoardTabs tabs={ticketsTabs} tab={currTab} setTab={changeTab}/>
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
                <TicketsLayout 
                user={user} 
                tickets={tickets} 
                organization_id={organization_id}
                currentLayout={currTab==="Tickets"}
                />
                <CreateTicketsLayout 
                user={user} 
                tickets={tickets} 
                organization_id={organization_id} 
                triggerRefresh={triggerRefresh} 
                currentLayout={currTab==="Create tickets"}
                />
            </div>
        </div>
    )
}