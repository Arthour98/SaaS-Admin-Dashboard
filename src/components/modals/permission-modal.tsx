import styles from "@/components/main.module.css";
import permissions from "@/json/permisions.json";
import CustomButton from "../elements/customButton";
import { useEffect,useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faX } from "@fortawesome/free-solid-svg-icons";
import { UserCellProps } from "../dashboard/users-layout";

type ModalProps = 
{
    open:boolean,
    user: UserCellProps |null,
    closeModal:()=>void
}
export default function PermModal({open,user,closeModal}:ModalProps)
{
    const allPermissions = permissions?.permissions;
    const  userPermissions = user?.permissions;
    const [permissionsArr,setPermissionsArr] = useState<null | Map<string,boolean>>(null);

useEffect(()=>
{
    if(userPermissions == undefined)
    {
        return;
    }
    console.log("userPerms",userPermissions)
    console.log("allPerm:",allPermissions)
    const  unifiedPermissions = new Map();
    for(let i = 0 ; i<allPermissions.length; i++)
    {
        console.log("iteration running")
        const currPer = userPermissions[i] as string;
        const checked : boolean = allPermissions?.includes(currPer);
        if(checked)
        {
            unifiedPermissions.set(allPermissions[i],true)
        }
        else
        {
            unifiedPermissions.set(allPermissions[i],false)
        }
        
    }
    setPermissionsArr(unifiedPermissions);
},[allPermissions,userPermissions,open])

useEffect(()=>
{
    console.log("permisions:",permissionsArr);
},[permissionsArr])

const handleChangePerms = (key:string,value:boolean)=>
{
    setPermissionsArr(prev => {
    if (!prev) return null;

    const newPerms = new Map(prev);
    newPerms.set(key, !value);

    return newPerms;
});
}

const submitPermissions = async()=>
{
    
}

    if(!open)
    {
        return null;
    }

    

    return(
        <div className={styles.perModal}>
            <FontAwesomeIcon icon={faX} width={12} className={styles.closeIcon} onClick={()=>closeModal()}/>
            <div className={styles.perModalContent}>
                <div className={styles.permissionRow}>
                    {
                        Array.from(permissionsArr?.entries() ?? []).map(([key, value]) =>
                    (
                        <div className={styles.permCol} key={key}>
                            <label className={styles.permLabel}>{key}:</label>
                            <input
                            type="checkbox"
                            value={value.toString()}
                            onChange={()=>handleChangePerms(key,value)}
                            />
                        </div>
                    ))
                    }
                </div>
                <div className={styles.submitCol}>
                    <CustomButton 
                    className={styles.submitButton}
                    element="button"
                    content="Save"
                    onClick={submitPermissions}
                    />
                </div>
            </div>
        </div>
    )
}