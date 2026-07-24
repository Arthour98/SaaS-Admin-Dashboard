'use client'
import {useEffect,useState} from "react";
import styles from "@/components/main.module.css";
import CustomButton from "@/components/elements/customButton";
import { useQuery } from "@/lib/use-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStripe } from "@fortawesome/free-brands-svg-icons";


export default function IntegrationsClient({org}:{org:any})
{

const [selectedService,setSelectedService] = useState<null | string>(null)
const org_id = org?.organization.organization.id;
useEffect(()=>
{
    console.log("org_id:",org_id)
},[org_id])

const syncWithService = async (
  e: React.MouseEvent,
  selService: string
) => {
    if (!selService) return;

 if (selService === "stripe") {
        window.open(
            `/api/integrations/connect-stripe?org=${org_id}`,
            "stripeOAuth",
            "width=600,height=800,left=200,top=100"
        );
    }
}
    const selectService = ()=>
    {
        setSelectedService("stripe")
    }

    return(
        <div className={styles["dashboard-content"]}>
            <div className={styles.integrationsContainer}>
                <div className={styles.servicesCol}>
                    <div  
                        style={{
                        borderColor:selectedService ?"#22d3ee" : undefined
                        }}
                        className={styles.stripeIconWrapper}>
                        <FontAwesomeIcon
                        icon={faStripe}
                        color="cyan"
                        className={styles.stripeIcon}
                        cursor="pointer"
                        onClick={selectService}
                        />
                    </div>
                </div>
                <div className={styles.submitCol}>
                    <CustomButton
                    content="Sync"
                    className={styles.submitButton}
                    element="button"
                    onClick={(e)=>syncWithService(e,selectedService as string)}
                     />
                </div>
            </div>
        </div>
    )
}