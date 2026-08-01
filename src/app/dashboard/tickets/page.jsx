import Footer from "@/components/partials/footer";
import Header from "@/components/partials/header";
import Main from "@/components/partials/main";
import NavBar from "@/components/partials/navbar";
import "@/app/globals.css";
import TicketsClient from "./ticketsClient";
import { User } from "@/services/auth";
import { getOrgTickets, getOrganizationId } from "@/services/dashboard";



const getTickets = async () => {
    const user = await User();
    const tickets = (await getOrgTickets()).tickets;
    const org_id = (await getOrganizationId(user.user.id)).org_id

    return { user: user.user, tickets: tickets, org_id: org_id };
}



export default async function Page({ }) {

    const { user, tickets, org_id } = await getTickets();

    console.log("Userr:", user)
    console.log("tickets:", tickets)
    console.log("ORR|G_ID", org_id)


    return (<>
        <Header />
        <Main className="dashboardMain">
            <div className="dashboard-container">
                <div className="dashboard-nav">
                    <div className="pseudo40-col">
                    </div>
                    <NavBar />
                </div>
                <div className="dashboard-content-wrapper">
                    <TicketsClient />
                </div>
            </div>
        </Main>
        <Footer />
    </>
    )
}