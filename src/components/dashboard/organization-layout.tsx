import {useState,useEffect} from "react"
import styles from "@/components/main.module.css";
import CustomButton from "../elements/customButton";
import { useQuery } from "@/lib/use-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateRight, faCopy } from "@fortawesome/free-solid-svg-icons";

type organizationProps =
{
 id:number,
 name:string
}

type OrgInfoProps = 
{
    organization_id:number | null,
    org_name : string | null,
    created_at : string | null,
    current_token : string | null ,
    token_id : number,
    organizations : organizationProps[] | null
    position: string | null
}


export type OrgLayoutProps = 
{
    current_layout : boolean ,
    org_info : OrgInfoProps,
    user: any
}

export default function OrganizationLayout({current_layout,org_info,user}:OrgLayoutProps)
{

    const [isLoading,setIsLoading] = useState(false);
    const [orgName,setOrgName] = useState(""); // input for creating organization
    const [organizationId,setOrganizationId] = useState<string | null >(null) // input for joining organization
    const organizations = org_info.organizations ; // all organizations
    const [showTokenInput,setShowTokenInput] = useState(false);  // UI input state
    const [orgToken,setOrgToken]= useState("") //org token input value
    const [currentToken,setCurrentToken]= useState(""); // existing token for sending to others
    const [hasOrganization,setHasOrganization]= useState(false);

    const isOwner = org_info?.position ==="admin";


    const handleCreateOrg= async(e:React.FormEvent)=>
    {
        e.preventDefault();
        setIsLoading(true);
        const data = 
        {
            name:orgName,
            user_id:user?.id
        }
        try
        {
            const res = await useQuery("organizations/create",{method:"post",body:data});
            if(res.organization.success)
            {
                setIsLoading(false)
                setHasOrganization(true);
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
        id:Number(organizationId),
        token:orgToken
        }
        try
        {
            const res = await useQuery("organizations/join",{method:"post",body:data})
            if(res.data.success)
            {
                setIsLoading(false)
                setHasOrganization(true);
            }
        }
        catch(e)
        {
            console.error(e);
            setIsLoading(false);
        }
    }

    useEffect(()=>
    {
        if(organizationId!==null)
        {
            setShowTokenInput(true)
        }
        else
        {
            setShowTokenInput(false);
        }
    },[organizationId]) //trigger input visuality by selecting a organization

    useEffect(()=>
    {
        if(org_info?.org_name)
        {
            setHasOrganization(true);
            setCurrentToken(org_info.current_token as string)
        }
    },[org_info])

    const handleCopy = (token:string)=>
    {
        navigator.clipboard.writeText(token)
    }

    const requestNewToken = async()=>
    {
        const data = 
        {
           token_id : org_info.token_id ,
           user_id : user.id
        }
        try
        {
            const res = await useQuery("organizations/refresh-token",{method:"post",body:data});
            const new_token = res.data.token;
            setCurrentToken(new_token);
        }
        catch(e)
        {
            console.error(e);
        }
    }

    const handleAction = async (e:React.FormEvent<HTMLFormElement>)=>
    {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const action = formData.get("action");

        const data =
        {
            organization_id:org_info?.organization_id,
            user_id : user.user_id
        }
        switch (action) {
    case "rename":
        const renamed = await useQuery("organizations/edit",{method:"post",body:data})
      break;

    case "delete":
      const deleted = await useQuery("organizations/delete",{method:"post",body:data});
      break;

    case "leave":
      const left = await useQuery("organizations/leave",{method:"post",body:data});
      break;
  }
    }


    if(!current_layout)
    {
        return null;
    }

    return(
    //case the user doesnt have organization
    
    <div className={styles.organizationLayout}>
        {!org_info.org_name ?
        (<>
        <div className={styles.orgCreation}>
            <h3>Create your Organization</h3>
            <form className={styles.formOrgCreation} onSubmit={(e)=>handleCreateOrg(e)}>
                <div className="flex items-center w-[100%] gap-5">
                    <label className="font-semibold">Name:</label>
                    <input type="text" value={orgName}
                    onChange={(e)=>setOrgName(e.target.value)}
                    className={styles.createOrgInput}/>
                </div>
                <CustomButton
                element="input"
                content="Create"
                isLoading={isLoading}
                className={styles.createOrgButton}
                />
            </form>
        </div>
        <div className={styles.orgJoin}>
            <h3>
                Join organization
            </h3>
            <form onSubmit={(e)=>handleJoinOrg(e)}>
                <div className="flex">
                    <label className="font-semibold">Select Organization</label>
                    <select onChange={(e)=>setOrganizationId(e.target.value)}>
                        {
                        Array.isArray(organizations) && organizations?.map(org=>(
                                <option key={org.id} value={org?.id}>{org?.name}</option>
                            ))
                        }
                    </select>
                </div>
                {
                    showTokenInput ?(
                        <div className={styles.orgTokenSection}>
                        <label>Token</label>
                        <CustomButton element="input" isLoading={isLoading} content="Submit"/>
                        </div>
                    )
                    :null
                }
            </form>
        </div>
        </>)
        :
        (
            <div className={styles.orgHandler}>
                <div className={styles.orgInfoCol}>
                    <div className="flex gap-2">
                        <p className="font-semibold">Organization:</p>
                        <p>{org_info.org_name}</p>
                    </div>
                    <div className="flex gap-2">
                        <p className="font-semibold">Position : </p>
                        <p>{org_info.position}</p>
                    </div>
                </div>
                <div className={styles.orgValidationTokenCol}>
                    <form id={styles.org_validation_token}>
                        <label className="font-semibold">Validation token: </label>
                        <input type="text"
                         value={currentToken}
                         readOnly={true}
                         className={styles.inputToken}
                         />
                        <FontAwesomeIcon
                        icon={faCopy}
                        width={12}
                        cursor="pointer"
                        onClick={()=>handleCopy(currentToken)}
                        />
                        <FontAwesomeIcon
                        icon={faArrowRotateRight}
                        width={12}
                        cursor="pointer"
                        onClick={requestNewToken}
                        />
                    </form>
                </div>
                <form className={styles.orgActionsCol} onSubmit={handleAction}>
                    {
                        isOwner ? 
                        (
                        <div className={styles.ownerActionsCol}>
                            <CustomButton element="input"
                            className={styles.editButton}
                            content="Rename"
                            isLoading={isLoading}
                            name="edit"/>
                            <CustomButton
                            element="input"
                            className={styles.deleteButton}
                            content="Delete"
                            isLoading={isLoading}
                            name="delete"
                            />
                        </div>
                        ) 
                        :
                        (
                            <CustomButton
                            element="input"
                            className={styles.deleteButton}
                            content="Leave"
                            isLoading={isLoading}
                            name="leave"
                            />
                        )
                    }
                </form>
            </div>
        )
        }
    </div>
    )
}