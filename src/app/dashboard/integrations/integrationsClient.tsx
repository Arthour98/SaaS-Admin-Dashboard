'use client'
import {useEffect,useState} from "react";
import styles from "@/components/main.module.css";
import CustomButton from "@/components/elements/customButton";
import { useQuery } from "@/lib/use-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStripe } from "@fortawesome/free-brands-svg-icons";
import InfoItem from "@/components/elements/info-item";


export default function IntegrationsClient({org,stripe}:
{
org:any,
stripe:any
})
{

const [selectedService,setSelectedService] = useState<null | string>(null)
const [hasIntegratedStripe,setHasIntegratedStripe]=useState(false);
const org_id = org?.organization.organization.id;

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

useEffect(()=>
{
 if(org_id === stripe.organization_id)
 {
    setHasIntegratedStripe(true);
 }
},[]);

    return(
        <div className={styles["dashboard-content"]}>
            <div className={styles.integrationsContainer}>
                <div className={styles.servicesCol}>
                    <div className="flex flex-col gap-2">
                        <div
                            style={{
                            borderColor:selectedService ?"#22d3ee" : undefined,
                            backgroundColor:hasIntegratedStripe ?"var(--lightgreen)" : undefined
                            }}
                            className={styles.stripeIconWrapper}>
                            <FontAwesomeIcon
                            icon={faStripe}
                            color={hasIntegratedStripe ? "white" : "cyan"}
                            className={styles.stripeIcon}
                            cursor="pointer"
                            onClick={selectService}
                            />
                        </div>
                        {hasIntegratedStripe &&<p className="text-sm">Integrated</p>}
                    </div>
                        
                </div>
                <div className={styles.submitCol}>
                    <CustomButton
                    content="Sync"
                    className={styles.submitButton}
                    element="button"
                    disabled={hasIntegratedStripe}
                    onClick={(e)=>syncWithService(e,selectedService as string)}
                     />
                     <InfoItem content={`By clicking the icon of service
                      and pressing sync you will migrate your services data to
                      application`}/>
                </div>
            </div>
        </div>
    )
}