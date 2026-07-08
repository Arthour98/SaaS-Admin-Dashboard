import Footer from "@/components/partials/footer";
import Header from "@/components/partials/header";
import Main from "@/components/partials/main";
import NavBar from "@/components/partials/navbar";
import "@/app/globals.css";
import DashBoardClient from "./dashboardClient";

export type UserProps = 
{
    id:number,
    name:string,
    created_at:string
}

export type OrgProps =
{
    id:number,
    name:string,
    members: any[],
    count : number,
    created_at : string,
    org_token : string
}

export const getUser = async()=>
{

}

export const getOrgData = async()=>
{
    
}

export default  function Page({user,org_data}:{user:UserProps,org_data:OrgProps})
{

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