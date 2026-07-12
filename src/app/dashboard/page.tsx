import Footer from "@/components/partials/footer";
import Header from "@/components/partials/header";
import Main from "@/components/partials/main";
import NavBar from "@/components/partials/navbar";
import "@/app/globals.css";
import DashBoardClient from "./dashboardClient";
import { User } from "@/services/auth";
import { getAllOrganizations, getUserOrganization } from "@/services/dashboard";
import { redirect } from "next/navigation";

export type UserProps = 
{
    id:number,
    name:string,
    created_at:string
}

export type OrgProps =
{
    id:number | null,
    name:string | null,
    members: any[] | null,
    count : number | null,
    created_at : string | null,
    org_token : string | null,
    organizations: any[] | null
    position:string | null
}

export const getUser = async()=>
{
    try
    {
    const user = await User();
    return user;
    }
    catch(e)
    {
        return null;
    }
}

export const getOrgData = async()=>
{
    const organization = await getUserOrganization();
    console.log("MY ORGGG:",organization)
    return{organization}
}

export const getOrgs = async()=>
{
    const organizations = await getAllOrganizations();
    console.log("ORGSSS:",organizations)
    return {organizations}
}

export default  async function Page()
{
    const user_res = await getUser();
    const org_data_res = await getOrgData();
    const orgs = await getOrgs();

    if(!user_res)
    {
        redirect("/");
    }

    const user:UserProps =
    {
        id:user_res.user.id,
        name:user_res.user.name,
        created_at: new Date(user_res.user.created_at).toISOString()
    }

const org = org_data_res.organization;


const org_data: OrgProps | any  =
    org
        ? {
              id: org.organization.id,
              name: org.organization.name,
              members: org.organization.members,
              count: org.organization.count,
              created_at: new Date(org.organization.created_at).toISOString(),
              org_token: org.organization.org_token,
              organizations: orgs.organizations,
              position:org.organization.position
          }
        : {
            organizations:orgs.organizations,
        };



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
                        <DashBoardClient user={user} org_data={org_data}/>
                    </div>
                </div>
            </Main>
        <Footer/>
        </>
    )
}