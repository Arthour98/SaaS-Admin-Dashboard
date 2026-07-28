import styles from "@/components/main.module.css";
import { OrderProps } from "@/app/dashboard/orders/ordersClient";
import { string_shortener } from "@/lib/string-shortener";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleXmark } from "@fortawesome/free-solid-svg-icons";
import { useQuery } from "@/lib/use-query";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";

export default function OrderCol({ order }: { order: OrderProps }) {

  const router =  useRouter();

  const deleteOrder = async(id:number)=>
  {
    const data = 
    {
        order_id:id
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
        <p>{order.status || "pending"}</p>
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
