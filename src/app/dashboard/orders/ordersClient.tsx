'use client'
import { useState } from "react";
import styles from "@/components/main.module.css";
import DashBoardTabs from "@/components/dashboard/dashboard-tabs";
import SearchBar from "@/components/elements/search-bar";
import OrdersLayout from "@/components/orders/orders-layout";
import CreateOrderLayout from "@/components/orders/create-order-layout";
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

export default function OrdersClient({
  orders,
  customers,
  user,
  organization,
}: {
  orders: OrderProps[];
  customers: Array<{ id: number; name: string }>;
  user: UserProps;
  organization: OrgProps;
}) {
  const dashBoardTabs = ["Orders", "Add order"];
  const [currTab, setCurrentTab] = useState("Orders");
  const [searchInput, setSearchInput] = useState("");

  const filteredOrders = orders.filter((order) => {
    const searchValue = searchInput.toLowerCase();
    return [order.name, order.status, order.origin, order.type].some((value) => value?.toLowerCase().includes(searchValue));
  });

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
        <CreateOrderLayout current_layout={currTab === "Add order"} orders={orders} customers={customers} user={user} organization={organization} />
      </div>
    </div>
  );
}