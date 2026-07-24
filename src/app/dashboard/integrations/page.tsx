import Footer from "@/components/partials/footer";
import Header from "@/components/partials/header";
import Main from "@/components/partials/main";
import NavBar from "@/components/partials/navbar";
import "@/app/globals.css";
import IntegrationsClient from "./integrationsClient";
import
{
    getCustomers,
    getInvoices,
    getSubscriptions
} from '@/services/stripe';
import { getUserOrganization} from "@/services/dashboard";


const getOrg = async()=>
{
    const org = await  getUserOrganization();
    return {organization:org}
}

const customers = async()=>
{
    const res = await getCustomers();
    return {customers:res.data}
}

const invoices = async()=>
{
    const res = await getInvoices();
    return {invoices:res.data}
}

const subscriptions = async()=>
{
    const res = await getSubscriptions();
    return {subs:res.data}
}

export default  async function Page({})
{
    const _customers = await customers();
    const _invoices = await invoices();
    const _subscriptions = await subscriptions();

    console.log("subs:",_subscriptions)
    console.log("customers",_customers);
    console.log("invoices",_invoices)

    const org = await getOrg();
    

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
                        <IntegrationsClient org={org}/>
                    </div>
                </div>
            </Main>
        <Footer/>
        </>
    )
}