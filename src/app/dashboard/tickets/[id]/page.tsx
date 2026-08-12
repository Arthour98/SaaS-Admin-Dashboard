import Footer from "@/components/partials/footer";
import Header from "@/components/partials/header";
import Main from "@/components/partials/main";
import NavBar from "@/components/partials/navbar";
import "@/app/globals.css";
import { User } from "@/services/auth";
import { getOrgTicket, getOrganizationId } from "@/services/dashboard";
import TicketClient from "./ticketClient";
import { redirect } from "next/navigation";
const getTicket = async ({params}
    :
    {
        params:Promise<{id:string}>
    }
) => {
    const user = await User();
    const ticket_id = Number((await params).id);
    const org_id = (await getOrganizationId(user?.user?.id))?.org_id
    const tickets = (await getOrgTicket(user?.user.id, org_id,ticket_id))?.ticket;
    if(!org_id)
    {
        redirect("/dashboard")
    }
    return { 
        user: user?.user,
        ticket: tickets,
        org_id: org_id };
}



export default async function Page({params}
    :
    {
          params:Promise<{id:string}>
    }
) {

    const { user, ticket, org_id } = await getTicket({params});

    return (<>
        <Header showMenu />
        <Main className="dashboardMain">
            <div className="dashboard-container">
                <div className="dashboard-nav">
                    <div className="pseudo40-col">
                    </div>
                    <NavBar />
                </div>
                <div className="dashboard-content-wrapper">
                    <TicketClient
                        user={user}
                        organization_id={org_id}
                        ticket={ticket}
                    />
                </div>
            </div>
        </Main>
        <Footer />
    </>
    )
}