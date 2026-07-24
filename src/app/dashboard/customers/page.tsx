import Footer from "@/components/partials/footer";
import Header from "@/components/partials/header";
import Main from "@/components/partials/main";
import NavBar from "@/components/partials/navbar";
import "@/app/globals.css";
import CustomersClient from "./customersClient";
import { fetchCustomers } from "@/services/dashboard";

const getCustomers = async()=>
{
    const customers = await fetchCustomers();
    return customers;
}

export default async function Page({})
{

    const customers = (await getCustomers())?.customers;
    
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
                        <CustomersClient customers={customers}/>
                    </div>
                </div>
            </Main>
        <Footer/>
        </>
    )
}