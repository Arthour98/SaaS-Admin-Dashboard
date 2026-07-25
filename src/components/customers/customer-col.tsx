import { CustomerProps } from "@/app/dashboard/customers/customersClient";
import styles from "@/components/main.module.css";

export default function CustomerCol(
{customer}:
{customer:CustomerProps})
{
    return(
    <div className={styles.customerCol}>
     <div className={styles.nameCus}>
        <p>{customer.name}</p>
     </div>
     <div className={styles.phoneCus}>
        <p>{customer.phone_number}</p>
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
    </div>
    )
}