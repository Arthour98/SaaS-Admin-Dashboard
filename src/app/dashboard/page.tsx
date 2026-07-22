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
    created_at:string,
    permissions: string[]
}

export type OrgProps =
{
    owner_id : number,
    organization_id:number | null,
    name:string | null,
    members: any[] | null,
    count : number | null,
    created_at : string ,
    org_token : string  | any,
    token_id:number | any,
    organizations: any[] | null,
    position:string | null,
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
    return{data:organization}
}

export const getOrgs = async()=>
{
    const organizations = await getAllOrganizations();
    console.log("ORGSSS:",organizations)
    return {data:organizations}
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


const org = org_data_res.data;

const user:UserProps =
    {
        id:user_res.user.id,
        name:user_res.user.name,
        created_at: new Date(user_res.user.created_at).toLocaleDateString(),
        permissions:org?.organization.permissions
    }

const org_data: OrgProps | any  =
    org
        ? {
              organization_id: org.organization.id,
              name: org.organization.name,
              members: org.members,
              count: org.members?.length,
              created_at: new Date(org.organization.created_at).toLocaleDateString(),
              org_token: org?.token?.token,
              token_id : org?.token?.token_id,
              organizations: orgs.data.organizations,
              position:org.organization.position,
              owner_id : org.organization.owner_id
          }
        : {
            organizations:orgs.data.organizations,
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