import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import styles from "@/components/main.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose, faFileCsv } from "@fortawesome/free-solid-svg-icons";
import InfoItem from "@/components/elements/info-item";
import CustomButton from "@/components/elements/customButton";
import { useQuery } from "@/lib/use-query";
import { useRouter } from "next/navigation";
import { OrgProps, UserProps } from "@/app/dashboard/page";
import { OrderProps } from "@/app/dashboard/orders/ordersClient";
import { useToast } from "@/db/hooks/use-toast";
import { usePerms } from "@/contexts/permissions";

export default function CreateOrderLayout({
  current_layout,
  orders,
  customers,
  user,
  organization,
}: {
  current_layout: boolean;
  orders: OrderProps[];
  customers: Array<{ id: number; name: string }>;
  user: UserProps;
  organization: OrgProps;
}) {
  const rowRef = useRef<HTMLButtonElement | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const router = useRouter();
  const {isPermited}=usePerms();

  type OrderInput = {
    order_name: string;
    customer_id: string;
    price: string;
    status: string;
    origin: string;
    type: string;
  };

  const [orderRows, setOrderRows] = useState<OrderInput[]>([
    { order_name: "", customer_id: "", price: "", status: "pending", origin: "manual", type: "product" },
  ]);

  useEffect(() => {
    if (!current_layout) {
      setOrderRows([{ order_name: "", customer_id: "", price: "", status: "pending", origin: "manual", type: "product" }]);
    }
  }, [current_layout]);

  useEffect(() => {
    rowRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [orderRows.length]);

  const addOrder = () => {
    setOrderRows((prev) => [
      ...prev,
      { order_name: "", customer_id: "", price: "", status: "pending", origin: "manual", type: "product" },
    ]);
  };

  const deleteOrder = useCallback((index: number) => {
    setOrderRows((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const handleOrderChange = (index: number, field: keyof OrderInput, value: string) => {
    setOrderRows((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleCsvImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const text = await file.text();
    const rows = text
      .split(/\r?\n/)
      .map((row) => row.split(",").map((value) => value.trim()))
      .filter((row) => row.some((value) => value));

    if (rows.length === 0) return;

    const headers = rows[0];
    const dataRows = rows.slice(1);

    const mappedRows = dataRows.map((row) => {
      const rowData: Record<string, string> = {};

      headers.forEach((header, index) => {
        rowData[header] = row[index] || "";
      });

      return rowData;
    });

    if (mappedRows.length) {
      setOrderRows(
        mappedRows.map((row) => ({
          order_name: row.name || row.order_name || "",
          customer_id: row.customer_id || "",
          price: row.price || "",
          status: row.status || "pending",
          origin: row.origin || "manual",
          type: row.type || "product",
        }))
      );
    }
  };

  const submitOrders = async (e: React.MouseEvent) => {
    e.preventDefault();

    if(!isPermited("add_order"))
    {
      useToast({type:"warning",message:"You dont have the permission to create orders"})
      return;
    }
    if(orderRows.some((order:OrderInput)=>order.order_name==""))
    {
      useToast({type:"warning",message:"Order name cant be empty"})
      return;
    }
    if(orderRows.some((order:OrderInput)=>order.customer_id==""))
    {
      useToast({type:"warning",message:"Customer name cant be empty"})
      return;
    }
    if(orderRows.some((order:OrderInput)=>order.price==""))
    {
      useToast({type:"warning",message:"Order price cant be empty"})
      return;
    }

    setLoadingSubmit(true);
    const payload = {
      orders: orderRows.map((row) => ({
        name: row.order_name,
        customer_id: Number(row.customer_id),
        price: row.price,
        status: row.status,
        origin: row.origin,
        type: row.type,
      })),
      organization_id: organization.organization_id,
      user_id:user.id,
      user_name:user.name
    };

    try {
      const res = await useQuery("orders/create", { method: "post", body: payload });
      if (res?.data?.status === "success") {
        setLoadingSubmit(false);
        router.refresh();
        setOrderRows([{ order_name: "", customer_id: "", price: "", status: "pending", origin: "manual", type: "product" }]);
        useToast({ type: "success", message: "Orders created successfully" });
      } else {
        setLoadingSubmit(false);
      }
    } catch (error) {
      console.error("[CLIENT_ERROR]", error);
      setLoadingSubmit(false);
    }
  };

  if (!current_layout) return null;

  return (
    <div className={styles.createOrdersLayout}>
      <div className={styles.csvCol}>
        <InfoItem content="Import CSV with headers: name, customer_id, price, status, origin, type" />
        <FontAwesomeIcon className={styles.csvIcon} icon={faFileCsv} onClick={triggerFileInput} />
        <input ref={fileInputRef} type="file" className={styles.fileInput} onChange={handleCsvImport} />
      </div>

      <div className={styles.addOrderCol}>
        {orderRows.map((order, index) => (
          <div key={index} className={styles.orderRow}>
            <div className={styles.orderFieldCol}>
              <label className={styles.labelSpace}>Order name*</label>
              <input
                spellCheck={false}
                className={styles.orderInput}
                type="text"
                placeholder="Order name"
                value={order.order_name}
                onChange={(e) => handleOrderChange(index, "order_name", e.target.value)}
              />
            </div>
            <div className={styles.orderFieldCol}>
              <label className={styles.labelSpace}>Customer*</label>
              <select
                className={styles.orderInput}
                value={order.customer_id}
                onChange={(e) => handleOrderChange(index, "customer_id", e.target.value)}
              >
                <option value="">Select customer</option>
                {customers.filter(cus=>cus.name!==null&& cus.name!=="")
                .map((customer) => (
                  <option key={customer.id} value={customer.id}>
                    {customer.name}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.orderFieldCol}>
              <label className={styles.labelSpace}>Price*</label>
              <input
                spellCheck={false}
                className={styles.orderInput}
                type="text"
                placeholder="Price"
                value={order.price}
                onChange={(e) => handleOrderChange(index, "price", e.target.value)}
              />
            </div>
            <div className={styles.orderFieldCol}>
              <label className={styles.labelSpace}>Status</label>
              <select
                className={styles.orderInput}
                value={order.status}
                onChange={(e) => handleOrderChange(index, "status", e.target.value)}
              >
                <option value="pending">pending</option>
                <option value="succeded">succeded</option>
              </select>
            </div>
            <div className={styles.orderFieldCol}>
              <label className={styles.labelSpace}>Origin</label>
              <input
                readOnly
                spellCheck={false}
                className={styles.orderInput}
                type="text"
                placeholder="manual"
                value={order.origin}
                onChange={(e) => handleOrderChange(index, "origin", e.target.value)}
              />
            </div>
            <div className={styles.orderFieldCol}>
              <label className={styles.labelSpace}>Type</label>
              <input
                spellCheck={false}
                className={styles.orderInput}
                type="text"
                placeholder="product"
                value={order.type}
                onChange={(e) => handleOrderChange(index, "type", e.target.value)}
              />
            </div>
            <FontAwesomeIcon icon={faClose} className={styles.deleteRow} onClick={() => deleteOrder(index)} />
          </div>
        ))}

        <button ref={rowRef} onClick={addOrder} className={styles.addCustomerButton}>
          Add Order
        </button>
      </div>

      <div className={styles.submitCustomerCol}>
        <CustomButton content="Submit" element="button" isLoading={loadingSubmit} className={styles.submitButton} onClick={(e) => submitOrders(e)} />
      </div>
    </div>
  );
}
