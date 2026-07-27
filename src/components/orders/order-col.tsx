import styles from "@/components/main.module.css";
import { OrderProps } from "@/app/dashboard/orders/ordersClient";

export default function OrderCol({ order }: { order: OrderProps }) {
  return (
    <div className={styles.orderCol}>
      <div className={styles.orderNameCol}>
        <p>{order.name || "Untitled order"}</p>
      </div>
      <div className={styles.orderPriceCol}>
        <p>{order.price ? `$${order.price}` : "-"}</p>
      </div>
      <div className={styles.orderStatusCol}>
        <p>{order.status || "pending"}</p>
      </div>
      <div className={styles.orderOriginCol}>
        <p>{order.origin || "manual"}</p>
      </div>
      <div className={styles.orderTypeCol}>
        <p>{order.type || "product"}</p>
      </div>
    </div>
  );
}
