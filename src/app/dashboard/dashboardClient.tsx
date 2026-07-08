'use client'
import {useEffect,useState} from "react";
import styles from "@/components/main.module.css";
import InfoLayout from "@/components/dashboard/info-layout";
import OrganizationLayout from "@/components/dashboard/organization-layout";
import UsersLayout from "@/components/dashboard/users-layout";
import DashBoardTabs from "@/components/dashboard/dashboard-tabs";
import SearchBar from "@/components/elements/search-bar";
import { UserProps } from "./page";
import { OrgProps } from "./page";
export default function DashBoardClient({user,org_data}:{user:UserProps,org_data:OrgProps})
{

const dashBoardTabs = ["Info","Organizations","Users"]  // tabs array
const [currTab,setCurrentTab] = useState("Info") // selected tab


const [searchInput,setSearchInput]= useState("")

const changeTab = (tab:string) =>
{
    setCurrentTab(tab);
}

return(
    <div className={styles["dashboard-content"]}>
        <div className={styles.filterRow}>
            <div className="filterCol">
                <DashBoardTabs tabs={dashBoardTabs} tab={currTab}  setTab={changeTab} />
            </div>
            <div className={styles.searchCol}>
                <SearchBar className={styles.searchBar} value={searchInput} setValue={setSearchInput} />
            </div>
        </div>
        <div className={styles["content-main"]}>
            <InfoLayout current_layout={currTab === "Info"} info={info} />
            <OrganizationLayout current_layout={currTab ==="Organizations"} user={user} org_info={org_info}/>
            <UsersLayout current_layout={currTab === "Users"} users={users} />
        </div>
    </div>
)
}