import styles from "@/components/main.module.css";
import { string_shortener } from "@/lib/string-shortener";
import { useState } from "react";
export default function TicketRow({ticket_id,title,message_count,created_at,author,openTicket}:
    {
        ticket_id:number,
        title:string,
        created_at:string,
        author:string
        message_count:number,
        openTicket:(ticket_id:number)=>void;
    })
{

    const [isHovering,setIsHovering] = useState(false);

return(
<div 
className={styles.ticketRow}
style={{
border:isHovering ? `2px solid var(--selCyan)`:`2px solid #fcf9f9`
}}
onClick={()=>openTicket(ticket_id)}
onMouseEnter={()=>setIsHovering(true)}
onMouseLeave={()=>setIsHovering(false)}
>
    <div className={styles.ticketTitle}>
        <p className="font-semibold">Ticket:</p>
        <p>{string_shortener(title)}</p>
    </div>
    <p className="hidden md:block">-</p>
    <div className={styles.ticketAuthor}>
        <p className="font-semibold">Poster:</p>
        <p>{author}</p>
    </div>
    <p className="hidden md:block">-</p>
    <div className={styles.ticketCreation}>
        <p className="font-semibold">Date:</p>
        <p>Date:{created_at}</p>
    </div>
    <div className={styles.MessageCount}>
        <p className="font-semibold">messages:</p>
        <p>{message_count}</p>
    </div>
</div>
)
}