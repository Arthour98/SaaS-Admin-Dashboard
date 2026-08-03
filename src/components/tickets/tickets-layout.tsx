import styles from "@/components/main.module.css";
import { TicketsProps } from "@/app/dashboard/tickets/ticketsClient"
import { UserProps } from "@/app/dashboard/page";
import TicketRow from "./ticket-row";

export default function TicketsLayout({tickets,user,organization_id,currentLayout,openTicket}:
    {
        tickets:TicketsProps[],
        user:UserProps,
        organization_id:number,
        currentLayout:boolean
        openTicket:(ticket_id:number)=>void
    }
)
{

    if(!currentLayout)
    {
        return null;
    }

    return (
        <div className={styles.ticketsLayout}>
            {
            tickets?.map(ticket=>
            (
                <TicketRow 
                key={ticket.id}
                ticket_id={ticket?.id} 
                title={ticket?.title as string}
                author={ticket?.user_name as string}
                created_at={new Date (ticket.created_at).toLocaleDateString()}
                message_count={ticket.message_count}
                openTicket={openTicket}
                />
            )
            )
            }
        </div>
    )
}