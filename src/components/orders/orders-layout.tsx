import styles from "@/components/main.module.css";
import OrderCol from "./order-col";
import { OrderProps } from "@/app/dashboard/orders/ordersClient";

export default function OrdersLayout({
  current_layout,
  orders,
}: {
  current_layout: boolean;
  orders: OrderProps[];
}) {
  if (!current_layout) return null;

  return orders.length === 0 ? (
    <p>There are no orders listed!</p>
  ) : (
    <div className={styles.ordersLayout}>
      <div className={styles.ordersHeader}>
        <div className={styles.orderCol2}><p>Name</p></div>
        <div className={styles.orderCol2}><p>Price</p></div>
        <div className={styles.orderCol2}><p>Status</p></div>
        <div className={styles.orderCol2}><p>Origin</p></div>
        <div className={styles.orderCol2}><p>Type</p></div>
      </div>
      <div className={styles.ordersContent}>
        {orders.map((order) => (
          <OrderCol key={order.id} order={order} />
        ))}
      </div>
    </div>
  );
}
