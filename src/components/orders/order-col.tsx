import styles from "@/components/main.module.css";
import { OrderProps } from "@/app/dashboard/orders/ordersClient";
import { string_shortener } from "@/lib/string-shortener";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@/lib/use-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/db/hooks/use-toast";
import { UserProps } from "@/app/dashboard/page";
import { useState,useEffect } from "react";
import { usePerms } from "@/contexts/permissions";

export default function OrderCol(
  {
   order,
   user,
   }
   :
  { 
    order: OrderProps,
    user:UserProps 
  }) {

  const {isPermited} = usePerms();
  const router =  useRouter();
  const [selectedStatus,setSelectedStatus] = useState(order.status)
  const [statusHasChanged,setStatusHasChanged]= useState(false);
  const handleChangeStatus = (e: React.ChangeEvent<HTMLSelectElement>)=>
  {
    setSelectedStatus(e.target.value)
    setStatusHasChanged(true);
  }

  const updateOrder = async()=>
  {
    if(!isPermited("add_order"))
    {
      useToast({type:"warning",message:"You dont have the permissions to change status!"});
      return;
    }
    try
    {
      const data=
      {
        order_id:order.id,
        user_id:user.id,
        user_name:user.name,
        organization_id:order.organization_id,
        status:selectedStatus,
        product_name:order.name
      }
      const res = await useQuery("orders/update",{method:"put",body:data});
      if(res.data.status==="success")
      {
        useToast({type:"success",message:"Order updated successfully!"})
      }
    }
    catch(e)
    {
      console.error(e);
      useToast({type:"error",message:e as string})
    }
  }

  useEffect(()=>
  {
    if(!statusHasChanged)
    {
      return;
    }
    updateOrder();
  },[statusHasChanged]);
  const deleteOrder = async(id:number)=>
  {
    if(!isPermited("delete_order"))
    {
      useToast({type:"warning",message:"You dont have the permissions to delete orders!"});
      return;
    }
    const data = 
    {
        order_id:id,
        user_id:user.id,
        user_name:user?.name,
        order_name:order.name,
        organization_id:order.organization_id
    }
    try
    {
        const res = await useQuery("orders/delete",{method:"delete",body:data})
        if(res.data.status="success")
        {
          router.refresh();
          useToast({type:"success",message:"Successfuly deleted order"})
        }
    }
    catch(e)
    {
        console.error(e);
        useToast({type:'error',message:"Error deleting order"})
    }
  }  
  return (
    <div className={styles.orderCol}>
      <div className={styles.orderNameCol}>
        <p>{order?.name ?string_shortener(order?.name) : "Untitled order"}</p>
      </div>
      <div className={styles.orderPriceCol}>
        <p>{order.price ? `$${order.price}` : "-"}</p>
      </div>
      <div className={styles.orderStatusCol}>
      {
        selectedStatus==="pending" ?
        (
          <select className={styles.selectStatus} onChange={handleChangeStatus}>
            <option value={order.status} >{order.status}</option>
            <option value={"succeded"} >succeded</option>
          </select>
        ) :
        (
        <p>{order.status || "pending"}</p>
        )
      }
      </div>
      <div className={styles.orderOriginCol}>
        <p>{order.origin}</p>
      </div>
      <div className={styles.orderTypeCol}>
        <p>{order.type}</p>
      </div>
      <div className={styles.deleteCol}>
        <FontAwesomeIcon
         icon={faCircleXmark}
        className={styles.deleteIcon}
        onClick={()=>deleteOrder(order.id)}
        />
      </div>
    </div>
  );
}
