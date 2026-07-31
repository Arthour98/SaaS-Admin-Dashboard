'use client'
import { useMemo, useState } from "react";
import styles from "@/components/main.module.css";
import DashBoardTabs from "@/components/dashboard/dashboard-tabs";
import SearchBar from "@/components/elements/search-bar";
import OrdersLayout from "@/components/orders/orders-layout";
import CreateOrderLayout from "@/components/orders/create-order-layout";
import CustomerOrdersLayout from "@/components/orders/customer-orders-layout";
import { UserProps } from "@/app/dashboard/page";
import { OrgProps } from "@/app/dashboard/page";

export interface OrderProps {
  id: number;
  name: string;
  price: string;
  status: string;
  origin: string;
  type: string;
  created_at: string;
  organization_id: number;
}

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

export default function OrdersClient({
  orders,
  customers,
  customerOrders,
  user,
  organization,
}: {
  orders: OrderProps[];
  customers: Array<{ id: number; name: string }>;
  customerOrders: CustomerOrderRowProps[];
  user: UserProps;
  organization: OrgProps;
}) {
  const dashBoardTabs = ["Orders", "Customers orders", "Add order"];
  const [currTab, setCurrentTab] = useState("Orders");
  const [searchInput, setSearchInput] = useState("");

  const filteredOrders = useMemo(() => {
    const searchValue = searchInput.toLowerCase();
    return orders.filter((order) => {
      return [order.name, order.status, order.origin, order.type].some((value) => value?.toLowerCase().includes(searchValue));
    });
  }, [orders, searchInput]);

  const filteredCustomerOrders = useMemo(() => {
    const searchValue = searchInput.toLowerCase();
    return customerOrders.filter((order) => {
      return [
        order.customer_name,
        order.product_name,
        order.price,
        order.created_at,
        order.status,
      ].some((value) => {
        if (value == null) return false;
        return String(value).toLowerCase().includes(searchValue);
      });
    });
  }, [customerOrders, searchInput]);

  return (
    <div className={styles["dashboard-content"]}>
      <div className={styles.filterRow}>
        <div className={styles.filterCol}>
          <DashBoardTabs tabs={dashBoardTabs} tab={currTab} setTab={setCurrentTab} />
        </div>
        <div className={styles.searchCol}>
          <SearchBar 
            currentTab={currTab}
            value={searchInput}
            setValue={setSearchInput}
            className={styles.searchBar} />
        </div>
      </div>
      <div className={styles["content-main"]}>
        <OrdersLayout current_layout={currTab === "Orders"} orders={filteredOrders} />
        <CustomerOrdersLayout current_layout={currTab === "Customers orders"} customerOrders={filteredCustomerOrders} />
        <CreateOrderLayout current_layout={currTab === "Add order"} orders={orders} customers={customers} user={user} organization={organization} />
      </div>
    </div>
  );
}