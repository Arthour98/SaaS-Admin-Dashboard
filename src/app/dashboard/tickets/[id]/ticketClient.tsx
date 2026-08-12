'use client'
import {useEffect,useState} from "react";
import styles from "@/components/main.module.css";
import { UserProps } from "../../page";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowCircleLeft } from "@fortawesome/free-solid-svg-icons";
import CustomButton from "@/components/elements/customButton";
import { useQuery } from "@/lib/use-query";
import { useToast } from "@/db/hooks/use-toast";

export interface TicketProps
{
    id:number,
    organization_id:number,
    title?:string | null,
    content?:string | null
    user_name?:string,
    created_at:string
    message_count:number
}
export default function TicketClient(
    {ticket,user,organization_id}:
    {
    ticket:TicketProps,
    user:UserProps,
    organization_id:number
    }
){
    const router = useRouter();
    const [isSubmitLoading,setIsSubmitLoading] = useState(false); 
    const [messageInput,setMessageInput] = useState("");
    const [messages,setMessages]=useState([]);

    const getMessages = async()=>
    {
        const data = {
            ticket_id:ticket.id,
            user_id:user.id
        }

        try
        {
        const res = await useQuery("tickets/get-messages",{method:"get",params:data});
        if(res.data.status=="success")
        {
            const new_messages = res.data.messages;
            setMessages(new_messages);
        }
        }
        catch(e)
        {
            console.error(e);
        }
    } //api call to populate messages

    useEffect(()=>
    {
     getMessages();
    },[]) //initial population of messages


    const submitMessage = async()=>
    {
        try
        {
            setIsSubmitLoading(true);
            const data=
            {
            ticket_id:ticket.id,
            organization_id:organization_id,
            user_id:user.id,
            message:messageInput

            }
            const res = await useQuery("tickets/send-message",{method:"post",body:data})
            if(res.data.status==="success")
            {
                useToast({type:'success',message:"Message sent successfully !"});
                setIsSubmitLoading(false);
                setMessages(res.data.messages);
                setMessageInput("")
            }
        }
        catch(e)
        {
            useToast({type:"error",message:"Error sending message !"})
            setIsSubmitLoading(false);
        }
    }


    
return(
<div className={styles["dashboard-content"]}>
    <div className={styles.backArrowCol}>
        <FontAwesomeIcon 
        icon={faArrowCircleLeft}
        className={styles.backArrowIcon}
        onClick={()=>router.back()}
        />
    </div> 
    <div className={styles["content-main-ticket"]}>
        <div className={styles.ticketLayout}>
            <div className={styles.ticketContent}>
                <div className={styles.ticketTitleCol}>
                    <h3>{ticket.title}</h3>
                </div>
                <div className={styles.ticketContentCol}>
                    <p>{ticket.content}</p>
                </div>
            </div>
                <div className={styles.messagesRow}>
                {
                    messages?.map((message:any)=>
                    (
                        <div key={message.id} className={styles.messageSection}>
                            <p className={"font-semibold"}>{message.user_name}: </p>
                            <p>{message?.message}</p>
                        </div>)
                    )
                }
                <textarea 
                className={styles.messageArea}
                placeholder="Message"
                value={messageInput}
                onChange={(e)=>setMessageInput(e.target.value)}
                />
                <div className={styles.submitTicketCol}>
                    <CustomButton
                    onClick={submitMessage}
                    element="button"
                    content="Send"
                    isLoading={isSubmitLoading}
                    className={styles.submitButton}
                    />
                </div>
            </div>
        </div>
    </div>
</div>
)
}