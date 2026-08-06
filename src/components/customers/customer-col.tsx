import { CustomerProps } from "@/app/dashboard/customers/customersClient";
import { UserProps } from "@/app/dashboard/page";
import styles from "@/components/main.module.css";
import { usePerms } from "@/contexts/permissions";
import { useToast } from "@/db/hooks/use-toast";
import { string_shortener } from "@/lib/string-shortener";
import { useQuery } from "@/lib/use-query";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useRouter } from "next/navigation";
export default function CustomerCol(
{customer,user}:
{
   customer:CustomerProps,
   user:UserProps
})
{
   const router = useRouter();
   const {isPermited} = usePerms();

   const deleteCustomer = async(id:number)=>
   {
      if(!isPermited("delete_customer"))
      {
         useToast({type:"warning",message:"You dont have the permissions to delete customers!"});
         return;
      }

      const data = 
      {
         customer_id:id,
         user_id:user.id,
         user_name:user?.name,
         organization_id:customer.organization_id,
         customer_name:customer.name
      }
      try
      {
         const res = await useQuery("customers/delete",{method:"delete",body:data})
         if(res.data.status="success")
         {
            router.refresh();
            useToast({type:'success',message:"Successfully deleted customer"})
         }
      }
      catch(e)
      {
         console.error(e);
         useToast({type:'error',message:"Error deleting customer"})
      }
   }
    return(
    <div className={styles.customerCol}>
     <div className={styles.nameCus}>
      <p>
         {
         customer.name ?
         string_shortener(customer.name):
         "Unknown"
         }
      </p>
     </div>
     <div className={styles.phoneCus}>
      <p>
         {
         customer.phone_number ?
         customer.phone_number :
         "-"
         }
      </p>
     </div>
     <div className={styles.createdCus}>
        <p>{new Date(customer.created_at).toLocaleDateString()}</p>
     </div>
     <div className={styles.originCus}>
        <p>
            {
                customer.origin
            }
        </p>
     </div>
     <div className={styles.cusDeleteCol}>
      <FontAwesomeIcon
      icon={faCircleXmark}
      className={styles.deleteIcon}
      onClick={()=>deleteCustomer(customer.id)}
      />
     </div>
    </div>
    )
}