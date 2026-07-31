import styles from "@/components/main.module.css";
import { string_shortener } from "@/lib/string-shortener";

export interface CustomerOrderRowProps {
  id: number;
  customer_name?: string | null;
  product_name?: string | null;
  price?: string | number | null;
  created_at?: string;
  status?: string;
  origin?: string;
  type?: string;
  organization_id?: number;
}

const formatDate = (value?: string) => {
  if (!value) return "-";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;

  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
};

export default function CustomerOrdersLayout({
  current_layout,
  customerOrders,
}: {
  current_layout: boolean;
  customerOrders: CustomerOrderRowProps[];
}) {
  if (!current_layout) return null;

  return customerOrders.length === 0 ? (
    <p>There are no customer orders listed!</p>
  ) : (
    <div className={styles.ordersLayout}>
      <div className={styles.ordersHeader}>
        <div className={styles.orderCol2}><p>Customer</p></div>
        <div className={styles.orderCol2}><p>Product</p></div>
        <div className={styles.orderCol2}><p>Price</p></div>
        <div className={styles.orderCol2}><p>Created</p></div>
        <div className={styles.orderCol2}><p>Status</p></div>
      </div>
      <div className={styles.ordersContent}>
        {customerOrders.map((order) => (
          <div key={order.id} className={styles.orderCol}>
            <div className={styles.orderNameCol}>
              <p>{order.customer_name || "Unknown customer"}</p>
            </div>
            <div className={styles.orderPriceCol}>
              <p>{order.product_name ? string_shortener(order.product_name) : "Untitled product"}</p>
            </div>
            <div className={styles.orderStatusCol}>
              <p>{order.price ? `$${Number(order.price).toFixed(2)}` : "-"}</p>
            </div>
            <div className={styles.orderOriginCol}>
              <p>{formatDate(order.created_at)}</p>
            </div>
            <div className={styles.orderTypeCol}>
              <p>{order.status || "pending"}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
