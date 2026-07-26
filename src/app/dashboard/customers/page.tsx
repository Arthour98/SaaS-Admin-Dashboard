import Footer from "@/components/partials/footer";
import Header from "@/components/partials/header";
import Main from "@/components/partials/main";
import NavBar from "@/components/partials/navbar";
import "@/app/globals.css";
import CustomersClient from "./customersClient";
import { fetchCustomers } from "@/services/dashboard";
import { getOrganization } from "@/db/queries/organizations";
import { User } from "@/services/auth";
import { createConnection } from "@/db/connection";
import { UserProps } from "../page";

const getCustomers = async()=>
{
    const customers = await fetchCustomers();
    return customers;
}
const getOrgAndUser = async()=>
{
    const conn = await createConnection();
    const _user  = await User();
    const user_id =_user?.user.id
    const org = await  getOrganization(conn,user_id)
    const user : UserProps =
    {
       id:_user?.user.id,
       name:_user?.user.name ,
       created_at:_user?.user.created_at
    }
    org.organization_id = org.id
    return {user:user,organization:org}
}

export default async function Page({})
{
    const {user,organization} = await getOrgAndUser();
    const customers = (await getCustomers())?.customers;
    console.log("ORG_IDD",organization.organization_id)
    return(<>
        <Header/>
            <Main className="dashboardMain">
                <div className="dashboard-container">
                    <div className="dashboard-nav">
                        <div className="pseudo40-col">
                        </div>
                        <NavBar/>
                    </div>
                    <div className="dashboard-content-wrapper">
                        <CustomersClient 
                        user={user}
                        organization={organization}
                        customers={customers}/>
                    </div>
                </div>
            </Main>
        <Footer/>
        </>
    )
}