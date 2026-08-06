import Footer from "@/components/partials/footer";
import Header from "@/components/partials/header";
import Main from "@/components/partials/main";
import NavBar from "@/components/partials/navbar";
import "@/app/globals.css";
import OrdersClient from "./ordersClient";
import { fetchOrders, fetchCustomers, fetchCustomerOrders } from "@/services/dashboard";
import { getOrganization } from "@/db/queries/organizations";
import { User } from "@/services/auth";
import { createConnection } from "@/db/connection";
import { UserProps } from "../page";
import { redirect } from "next/navigation";

const getOrgAndUser = async () => {
  const conn = await createConnection();
  const _user = await User();
  const user_id = _user?.user.id;
  const org = await getOrganization(conn, user_id);
  const user: UserProps = {
    id: _user?.user.id,
    name: _user?.user.name,
    created_at: _user?.user.created_at,
  };
  if(org)
  {
  org.organization_id = org?.id;
  }
  if(!org?.organization_id)
  {
    redirect("/dashboard");
  }
  return { user, organization: org };
};

export default async function Page() {
  const { user, organization } = await getOrgAndUser();
  const [ordersResponse, customersResponse, customerOrdersResponse] = await Promise.all([
    fetchOrders(),
    fetchCustomers(),
    fetchCustomerOrders(),
  ]);
  const orders = ordersResponse?.orders ?? [];
  const customers = customersResponse?.customers ?? [];
  const customerOrders = customerOrdersResponse?.customerOrders ?? [];

  return (
    <>
      <Header showMenu />
      <Main className="dashboardMain">
        <div className="dashboard-container">
          <div className="dashboard-nav">
            <div className="pseudo40-col"></div>
            <NavBar />
          </div>
          <div className="dashboard-content-wrapper">
            <OrdersClient orders={orders} customers={customers} customerOrders={customerOrders} user={user} organization={organization} />
          </div>
        </div>
      </Main>
      <Footer />
    </>
  );
}