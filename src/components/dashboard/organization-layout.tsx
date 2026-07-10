import {useState,useEffect} from "react"
import styles from "@/components/main.module.css";
import CustomButton from "../elements/customButton";
import { useQuery } from "@/lib/use-query";

type organizationProps =
{
 id:number,
 name:string
}

type OrgInfoProps = 
{
    org_name : string | null,
    created_at : string | null,
    current_token : string | null ,
    organizations : organizationProps[] | null
}


export type OrgLayoutProps = 
{
    current_layout : boolean ,
    org_info : OrgInfoProps,
    user: object
}

export default function OrganizationLayout({current_layout,org_info,user}:OrgLayoutProps)
{
    if(!current_layout)
    {
        return null;
    }

    const [isLoading,setIsLoading] = useState(false);
    const [orgName,setOrgName] = useState(""); // for creating organization
    const [organizationId,setOrganizationId] = useState<string | null >(null) //for joining organization
    const organizations = org_info.organizations ;

    const handleCreateOrg= async(e:React.FormEvent)=>
    {
        e.preventDefault();
        setIsLoading(true);
        const data = 
        {
            organization_name:orgName
        }
        try
        {
            const res = await useQuery("organizations/create",{method:"post",body:data});
            if(res.organization.success)
            {
                setIsLoading(false)
            }
            else
            {
                setIsLoading(false);
            }
        }
        catch(e)
        {
            setIsLoading(false);
        }
    }

    const handleJoinOrg = async(e:React.FormEvent)=>
    {
        e.preventDefault();
        setIsLoading(true);
        const data =
        {
        id:Number(organizationId)
        }
        try
        {
            const res = await useQuery("organizations/join",{method:"post",body:data})
            if(res.data.success)
            {
                setIsLoading(false)
            }
        }
        catch(e)
        {
            console.error(e);
            setIsLoading(false);
        }
    }

    return(
    //case the user doesnt have organization
    
    <div className={styles.organizationLayout}>
        !{org_info.org_name ?
        (<>
        <h3>Create your Organization</h3>
        <form onSubmit={(e)=>handleCreateOrg(e)}>
            <div className="flex">
                <label>Name:</label>
                <input type="text" value={orgName}
                 onChange={(e)=>setOrgName(e.target.value)}
                 className="w-[50%]"/>
                <CustomButton element="input" content="Create" isLoading={isLoading}/>
            </div>
        </form>
        <h3>
            Join organization
        </h3>
        <form onSubmit={(e)=>handleJoinOrg(e)}>
            <div className="flex">
                <label>Select Organization</label>
                <select onChange={(e)=>setOrganizationId(e.target.value)}>
                    {
                        organizations?.map(org=>(
                            <option key={org.id} value={org?.id}>{org?.name}</option>
                        ))
                    }
                </select>
            </div>
        </form>
        </>)
        :
        (
        <>
        
        </>
        )
        }
    </div>
    )
}