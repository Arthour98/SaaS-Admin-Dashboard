import {useState,useEffect} from "react"
import styles from "@/components/main.module.css";
import CustomButton from "../elements/customButton";
import { useQuery } from "@/lib/use-query";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRotateRight, faCopy } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "@/db/hooks/use-toast";
import { UserProps } from "@/app/dashboard/page";
import { usePerms } from "@/contexts/permissions";

type organizationProps =
{
 id:number,
 name:string
 token_id:number,
 owner_id:number
}

type OrgInfoProps = 
{
    organization_id:number | null,
    org_name : string | null,
    created_at : string | null,
    current_token : string | null ,
    token_id : number,
    organizations : organizationProps[] | null
    position: string | null,
    leader_name:string
}


export type OrgLayoutProps = 
{
    current_layout : boolean ,
    org_info : OrgInfoProps,
    user: UserProps,
    triggerRefresh : (data:string)=> void,
}


export default function OrganizationLayout({current_layout,org_info,user,triggerRefresh}:OrgLayoutProps)
{
    const {isPermited,useCustomTrigger}= usePerms();
    // loaders states for buttons
    const [isLoadingCreate,setIsLoadingCreate] = useState(false);
    const [isLoadingJoin,setIsLoadingJoin] = useState(false);
    const [isLoadingEdit,setIsLoadingEdit] = useState(false);
    const [isLoadingDelete,setIsLoadingDelete] = useState(false);
    //

    const [orgName,setOrgName] = useState(""); // input for creating organization
    const [organizationId,setOrganizationId] = useState<number|null>(null) // input for joining organization
    const [tokenId,setTokenId]=useState<number|null>(null) // token_id state need when joinin org so we can renew the token with fast index in db
    const [organizations,setOrganizations] = useState<any>([]) ; // all organizations
    const [showTokenInput,setShowTokenInput] = useState(false);  // UI input state
    const [orgToken,setOrgToken]= useState("") //org token input value
    const [currentToken,setCurrentToken]= useState(""); // existing token for sending to others
    const [hasOrganization,setHasOrganization]= useState(false);

    const [openEdit,setOpenEdit] = useState(false);

    const isOwner = org_info?.position ==="admin";


    const handleCreateOrg= async(e:React.FormEvent)=>
    {
        e.preventDefault();
        setIsLoadingCreate(true);
        const data = 
        {
            name:orgName,
            user_id:user?.id
        }
        try
        {
            const res = await useQuery("organizations/create",{method:"post",body:data});
            if(res.data.status="success")
            {
                setIsLoadingCreate(false)
                setHasOrganization(true);
                triggerRefresh(res.data.status);
                setOrgName("");
                useToast({
                type:"success",
                message:"Organization created successfully"
            });
            useCustomTrigger();
            }
            else
            {
                setIsLoadingCreate(false);
                useToast({
                type:"error",
                message:"Error creating organization"
            })
            }
        }
        catch(e)
        {
            setIsLoadingCreate(false);
        }
    }


    const handleJoinOrg = async(e:React.FormEvent)=>
    {
        e.preventDefault();
        setIsLoadingJoin(true);
        const data =
        {
        id:Number(organizationId),
        user_id:user.id,
        token_id:tokenId,
        token:orgToken,
        user_name:user?.name
        }
        try
        {
            const res = await useQuery("organizations/join",{method:"post",body:data})
            if(res.data.status="success")
            {
                setIsLoadingJoin(false)
                setHasOrganization(true);
                triggerRefresh(res.data.status);
                setOrgToken("");
                useToast({
                type:"success",
                message:"Successfully joined organization"
            });
            useCustomTrigger();
            }
        }
        catch(e)
        {
            console.error(e);
            setIsLoadingJoin(false);
                useToast({
                type:"error",
                message:"Error joining organization"
            })
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
        useToast({type:"info",message:"Token copied"})
    }

    const requestNewToken = async()=>
    {
        if(!isPermited("refresh_org_token"))
        {
            useToast({type:'warning',message:"You are not authorized to refresh to token"})
            return;
        }
        
        const data = 
        {
           token_id : org_info.token_id ,
           user_id : user.id,
           permited: isPermited("refresh_token"),
           organization_id:org_info.organization_id,
           user_name:user.name
        }
        try
        {
            const res = await useQuery("organizations/refresh-token",{method:"post",body:data});
            if(res.data.status="success"){
             const new_token = res.data.token.token;
            setCurrentToken(new_token);
            useToast({type:"info",message:"Token refreshed"})
            }
            if(res.data.stauts=="failed")
            {
            useToast({type:"error",message:res.data.error})
            }
        }
        catch(e)
        {
            console.error(e);
            useToast({type:"error",message:"Error refreshing token"})
        }
    }

    const handleAction = async (e:React.FormEvent<HTMLFormElement>)=>
    {
        e.preventDefault();
        const submitter = (e.nativeEvent as SubmitEvent).submitter as HTMLButtonElement;
 
        const action = submitter.name;

        const data =
        {
            organization_id:org_info?.organization_id,
            user_id : user.id,
            user_name : user.name
        }
        switch (action) {
    case "edit":
            setOpenEdit(true);
        break;
    case "delete":
        try
        {
            setIsLoadingDelete(true);
            const deleted = await useQuery("organizations/delete",{method:"delete",body:data});
            if(deleted.data.status==="success")
            {
                triggerRefresh(deleted.data.status);
                setHasOrganization(false);
                setIsLoadingDelete(false);
                useToast({type:"success",message:"Successfully deleted organization"})
            }
        }
        catch(e)
        {
            console.error("[ERROR]->",e);
            setIsLoadingDelete(true)
            useToast({type:"error",message:"Error deleting organization"})
        }
        break;
    case "leave":
        try
        {
            setIsLoadingDelete(true);
            const left = await useQuery("organizations/leave",{method:"delete",body:data});
            if(left.data.status="success")
            {
                triggerRefresh(left.data.status);
                setHasOrganization(false);
                setIsLoadingDelete(false);
                useToast({type:"success",message:"Successfully left organization"})
            }
        }
        catch(e)
        {
            setIsLoadingDelete(false);
            console.error("[ERROR]->",e);
            useToast({type:"error",message:"Error leaving organization"})
        }
        break;
  }
    }

 useEffect(() => {
    if (org_info?.organizations) {
        const orgs = Array.from(org_info.organizations); // this way we avoid duplication , and prevent hardcore bug
        orgs.unshift({id:-1,name:"Select",owner_id:-1,token_id:-1});
        setOrganizations(orgs);
    }
}, [org_info]);

    const editOrg = async(e:React.FormEvent<HTMLFormElement>)=>
    {
        if(!isPermited("edit_organization"))
        {
            useToast({type:'warning',message:"You are not authorized to edit organization!"});
            return;
        }
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("editOrg");
        const data = 
        {
           organization_id : org_info.organization_id ,
           user_id : user.id,
           name :   name
        }
        try
        {
            setIsLoadingEdit(true);
            const renamed = await useQuery("organizations/edit",{method:"put",body:data})
            if(renamed.data.status="success")
            {
                triggerRefresh(renamed.data.status);
                setOpenEdit(false);
                setIsLoadingEdit(false);
                useToast({type:"success",message:"Succesfully renamed organization"})
            }
        }
        catch(e)
        {
            console.error("[ERROR]->",e);
            setIsLoadingEdit(false);
            useToast({type:"error",message:"Error renaming organization"})
        }
    }

    const cancelEdit = (e:React.MouseEvent)=>
    {
        e.preventDefault();
        setOpenEdit(false);
    }

const handleChangeOrg = (e:React.ChangeEvent<HTMLSelectElement>) =>
{
    if(Number(e.target.value)>0)
    {
    const orgId = Number(e.target.value);
    const org = organizations.find((o: any) => o.id === orgId);
    setOrganizationId(orgId);
    setTokenId(org?.token_id);
    }
    else
    {
    setOrganizationId(null);
    setTokenId(null);
    }
}





    if(!current_layout)
    {
        return null;
    }

    return(
    //case the user doesnt have organization
    
    <div className={styles.organizationLayout}>
        {!hasOrganization ?
        (<>
        <div className={styles.orgCreation}>
            <h3>Create your Organization</h3>
            <form className={styles.formOrgCreation} onSubmit={(e)=>handleCreateOrg(e)}>
                <div className="flex flex-col lg:flex-row items-center w-[100%] gap-5">
                    <label className="font-semibold">Name:</label>
                    <input type="text" value={orgName}
                    onChange={(e)=>setOrgName(e.target.value)}
                    className={styles.createOrgInput}/>
                </div>
                <CustomButton
                element="input"
                content="Create"
                isLoading={isLoadingCreate}
                className={styles.createOrgButton}
                />
            </form>
        </div>
        <div className={styles.orgJoin}>
            <h3>
                Join organization
            </h3>
            <form onSubmit={(e)=>handleJoinOrg(e)}>
                <div className="flex flex-col lg:flex-row gap-2">
                    <label className="font-semibold">Select Organization</label>
                    <select onChange={(e)=>handleChangeOrg(e)}>
                        {
                        organizations?.map((org:any)=>(
                        <option key={org.id} value={org?.id}>{org?.name}</option>
                            ))
                        }
                    </select>
                </div>
                {
                    showTokenInput ?(
                    <div className={styles.orgTokenSection}>
                        <label>Token</label>
                        <input
                        className={styles.createOrgInput}
                        type="text"
                        value={orgToken}
                        onChange={(e)=>setOrgToken(e.target.value)}/>
                        <CustomButton
                        className={styles.createOrgButton}
                        element="input"
                        isLoading={isLoadingJoin}
                        content="Submit"/>
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
                        {
                            openEdit ?
                            (
                                <form onSubmit={editOrg} className={styles.editOrgForm} >
                                    <label>Organization:</label>
                                    <input type="text"
                                    defaultValue={org_info.org_name as string}
                                    name="editOrg"
                                    className={styles.generalInput}
                                    />
                                    <div className="flex gap-2">
                                        <CustomButton element="input"
                                        className={styles.submitButton}
                                        content="Save"
                                        isLoading={isLoadingEdit}
                                        name="edit"/>
                                        <CustomButton element="button"
                                        className={styles.deleteButton}
                                        content="Cancel"
                                        onClick={(e)=>cancelEdit(e)}
                                        />
                                    </div>
                                </form>
                            )
                            :
                            (
                            <div className="flex gap-2">
                                <p className="font-semibold">Organization:</p>
                                <p>{org_info.org_name}</p>
                            </div>
                            )
                        }
                    <div className="flex gap-2">
                        <p className="font-semibold">Position : </p>
                        <p>{org_info.position}</p>
                    </div>
                    <div className="flex gap-2">
                        <p className="font-semibold">Leader: </p>
                        <p>{org_info.leader_name}</p>
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
                <form className={styles.orgActionsCol} onSubmit={(e)=>handleAction(e)}>
                    <div className={styles.ownerActionsCol}>
                        {
                            isPermited("edit_organization") ? 
                            (
                            <CustomButton element="input"
                            className={styles.editButton}
                            content="Rename"
                            name="edit"/>
                            ):
                            null}
                        {
                            isPermited("delete_organization") && isOwner ?
                            (
                            <CustomButton
                            element="input"
                            className={styles.deleteButton}
                            content="Delete"
                            isLoading={isLoadingDelete}
                            name="delete"
                            />
                            ):
                            null
                        }       
                        {
                            !isOwner ?
                            (
                            <CustomButton
                            element="input"
                            className={styles.deleteButton}
                            content="Leave"
                            isLoading={isLoadingDelete}
                            name="leave"
                            />
                            ):
                            null
                        }
                        
                    </div>
                </form>
            </div>
        )
        }
    </div>
    )
}