import styles from "@/components/main.module.css";
import { TicketsProps } from "@/app/dashboard/tickets/ticketsClient"
import { UserProps } from "@/app/dashboard/page";

export default function TicketsLayout({tickets,user,organization_id,currentLayout}:
    {
        tickets:TicketsProps[],
        user:UserProps,
        organization_id:number,
        currentLayout:boolean
    }
)
{


    return (
        <div className={styles.ticketsLayout}>

        </div>
    )
}