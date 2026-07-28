import Footer from "@/components/partials/footer";
import Header from "@/components/partials/header";
import Main from "@/components/partials/main";
import NavBar from "@/components/partials/navbar";
import "@/app/globals.css";
import IntegrationsClient from "./integrationsClient";
import { getUserOrganization} from "@/services/dashboard";
import { getStripeService } from "@/services/stripe";




const getIntegrationsAndOrg = async()=>
{
    const org = await getUserOrganization();
    const stripe = await getStripeService(org?.organization.id);
    return {organization:org?.organization,stripe:stripe}
}


export default  async function Page({})
{
    const {org,stripe} = (await getIntegrationsAndOrg()) as any;
    

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
                        <IntegrationsClient org={org} stripe={stripe}/>
                    </div>
                </div>
            </Main>
        <Footer/>
        </>
    )
}