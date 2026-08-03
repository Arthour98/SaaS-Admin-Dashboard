'use client'
import {useCallback, useEffect,useState} from "react";
import styles from "@/components/main.module.css";
import InfoLayout from "@/components/dashboard/info-layout";
import OrganizationLayout from "@/components/dashboard/organization-layout";
import UsersLayout from "@/components/dashboard/users-layout";
import DashBoardTabs from "@/components/dashboard/dashboard-tabs";
import SearchBar from "@/components/elements/search-bar";
import { UserProps } from "./page";
import { OrgProps } from "./page";
import { useRouter } from "next/navigation";
import { UserCellProps } from "@/components/dashboard/users-layout";
import PermModal from "@/components/modals/permission-modal";
export default function DashBoardClient({user,org_data}:{user:UserProps,org_data:OrgProps})
{
const router = useRouter();
const dashBoardTabs = ["Info","Organization","Users"]  // tabs array
const [currTab,setCurrentTab] = useState("Info") // selected tab


const [searchInput,setSearchInput]= useState("")

const changeTab =(tab:string) =>
{
    setCurrentTab(tab);
}

const info =
{
    username:user.name,
    organization:org_data.name,
    organization_members:org_data.count,
    position:org_data.position ,
    joined : user.created_at, 
}

const org_info = 
{
    organization_id : org_data.organization_id,
    org_name : org_data.name,
    created_at : org_data.created_at,
    current_token :org_data.org_token ,
    token_id : org_data.token_id,
    organizations : org_data.organizations,
    position : org_data.position,
    owner_id:org_data.owner_id,
    leader_name:org_data?.leader_name
}

const users : any = 
{
    users : org_data.members
}

const triggerRefresh = useCallback((data:string)=>
{
    if(data="success")
    {
        router.refresh();
    }
},[])

    const [openPermissionModal,setOpenPermissionModal] = useState(false);
    const [userPerms,setUserPerms] = useState(null);
    const userArr = users?.users?.map((u:object)=>u); //Org users mapping
    const handleOpenPermiModal = useCallback((user_id:number)=>
    {
        if(user_id)
        {
            const selected_user = userArr?.find((u:UserCellProps) => u?.id ===user_id)
            if(selected_user)
            {
                setUserPerms(selected_user);
                setOpenPermissionModal(true);
            }
            
        }
    },[userPerms,openPermissionModal]);



    const handleClosePermModal = useCallback(()=>
    {
        setOpenPermissionModal(false);
    },[openPermissionModal])

return(
    <div className={styles["dashboard-content"]}>
        <div className={styles.filterRow}>
            <div className={styles.filterCol}>
                <DashBoardTabs tabs={dashBoardTabs} tab={currTab}  setTab={changeTab} />
            </div>
            <div className={styles.searchCol}>
                <SearchBar
                currentTab={currTab}
                className={styles.searchBar}
                value={searchInput}
                setValue={setSearchInput} />
            </div>
        </div>
        <div className={styles["content-main"]}>
            <InfoLayout 
            current_layout={currTab === "Info"}
            info={info} />
            <OrganizationLayout 
            current_layout={currTab ==="Organization"} 
            triggerRefresh={triggerRefresh} 
            user={user} 
            org_info={org_info}
            />
            <UsersLayout 
            current_layout={currTab === "Users"} 
            users={users} 
            isOwner={org_info.owner_id ===user.id} 
            currUser={user} 
            openPerms={handleOpenPermiModal}
            />
        </div>
        <PermModal
        org_id={org_info?.organization_id as number} 
        user={userPerms} 
        open={openPermissionModal} 
        closeModal={handleClosePermModal}
        triggerRefresh={triggerRefresh}
        />
    </div>
)
}