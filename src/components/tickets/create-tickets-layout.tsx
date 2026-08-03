import styles from "@/components/main.module.css";
import { TicketsProps } from "@/app/dashboard/tickets/ticketsClient"
import { UserProps } from "@/app/dashboard/page";
import CustomButton from "../elements/customButton";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useQuery } from "@/lib/use-query";

export default function CreateTicketsLayout({tickets,user,organization_id,triggerRefresh,currentLayout}:
    {
        tickets:TicketsProps[],
        user:UserProps,
        organization_id:number
        triggerRefresh : (status:string)=>void
        currentLayout:boolean
    })
{

const [ticketTitle,setTicketTitle] = useState("");
const [ticketContent,setTicketContent] = useState("");
const [loadingSubmit,setLoadingSubmit] = useState(false);


const submitTicket = async(e:React.MouseEvent)=>
{
    e.preventDefault();
    try
    {
        setLoadingSubmit(true);
        const data = 
        {
            title:ticketTitle,
            content:ticketContent,
            user_id:user?.id,
            organization_id:organization_id
        }

        const res = await useQuery("tickets/create",{method:"post",body:data});
        if(res.data.status==="success")
        {
            setLoadingSubmit(false);
            useToast({type:"success",message:"Successfully created a ticket"})
            triggerRefresh(res.data.status);
            setTicketContent("");
            setTicketTitle("");
        }
    }
    catch(e)
    {
        console.error(e)
        setLoadingSubmit(false);
        useToast({type:"error",message:"Error creating ticket!"})
    }
}

if(!currentLayout)
{
return null;
}

return (
<div className={styles.createTicketsLayout}>
  <div className={styles.addTicketCol}>
            <div className={styles.createTicketRow}>
                <div className={styles.ticketCreateTitleCol}>
                    <label className={styles.labelSpace}>Title*</label>
                    <input
                    spellCheck={false}
                    className={styles.titleInput}
                    type="text"
                    placeholder="Title"
                    value={ticketTitle}
                    onChange={(e) =>
                    setTicketTitle(e.target.value)
                    }
                />
                </div>
                <div className={styles.ticketCreateContentCol}>
                    <label className={styles.labelSpace}>Content</label>
                    <textarea
                    spellCheck={false}
                    className={styles.contentTextArea}
                    placeholder="Content"
                    value={ticketContent}
                    onChange={(e) =>
                        setTicketContent(e.target.value)
                     }
                />
                </div>
            </div>
    </div>
    <div className={styles.submitTicketCol}>
        <CustomButton
        content="Submit"
        element="button"
        isLoading={loadingSubmit}
        className={styles.submitButton}
        onClick={(e)=>submitTicket(e)}
        />
  </div>      
</div>
)
}