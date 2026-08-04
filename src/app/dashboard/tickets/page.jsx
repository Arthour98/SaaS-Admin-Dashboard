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
    const org_id = (await getOrganizationId(user.user.id)).org_id
    const tickets = (await getOrgTickets(user?.user.id, org_id)).tickets;

    return { user: user.user, tickets: tickets, org_id: org_id };
}



export default async function Page({ }) {

    const { user, tickets, org_id } = await getTickets();

    return (<>
        <Header showMenu/>
        <Main className="dashboardMain">
            <div className="dashboard-container">
                <div className="dashboard-nav">
                    <div className="pseudo40-col">
                    </div>
                    <NavBar />
                </div>
                <div className="dashboard-content-wrapper">
                    <TicketsClient
                        user={user}
                        organization_id={org_id}
                        tickets={tickets}
                    />
                </div>
            </div>
        </Main>
        <Footer />
    </>
    )
}