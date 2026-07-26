import {useState,useRef,useEffect, useMemo, useCallback} from "react"
import styles from "@/components/main.module.css";
import { CustomersLayoutProps } from "./customers-layout";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo, faClose, faFileCsv } from "@fortawesome/free-solid-svg-icons";
import InfoItem from "../elements/info-item";
import CustomButton from "../elements/customButton";


export default function AddCustomerLayout(
    {current_layout}:CustomersLayoutProps)
{
const rowRef = useRef<HTMLButtonElement | null>(null);

type Customer = {
customerName: string;
customerNumber: string;
};

 const [customers, setCustomers] = useState<Customer[]>([
  {
    customerName: "",
    customerNumber: "",
  },
    ]);

const addCustomer = () => {
  setCustomers((prev) => [
    ...prev,
    {
      customerName: "",
      customerNumber: "",
    },
  ]);
};

let deleteCustomer = useCallback((index:number) => {
    const new_customers = customers.filter((cus:Customer)=>
    customers.indexOf(cus) !== index)
    setCustomers(new_customers);
},[customers]);

useEffect(() => {
  rowRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "end",
  });
}, [customers.length]);

const handleCustomerChange = (index:number, field:keyof Customer,value:string) => {
  setCustomers((prev) => {
    const updated = [...prev];
    updated[index][field] = value;
    return updated;
  });
};



const submitCustomers = async()=>
{

}
    

if(!current_layout)
{
    return null;
}
return(
<div className={styles.createCustomersLayout}>
    <div className={styles.csvCol}>
        <InfoItem content="You can import your customers by csv file"/>
        <FontAwesomeIcon 
        className={styles.csvIcon}
        icon={faFileCsv} />
        <input type="file" className={styles.fileInput}/>
    </div>
    <div className={styles.addCustomerCol}>
        {customers.map((customer, index) =>{console.log(index, customers.length - 1);
        return (
            
            <div key={index} className={styles.customerRow}>
                <div className={styles.customerNameCol}>
                    <label className={styles.labelSpace}>Name</label>
                    <input
                    spellCheck={false}
                    className={styles.customerInput}
                    type="text"
                    placeholder="Customer Name"
                    value={customer.customerName}
                    onChange={(e) =>
                    handleCustomerChange(index, "customerName", e.target.value)
                    }
                />
                </div>
                <div className={styles.customerPhoneCol}>
                    <label className={styles.labelSpace}>Phone number</label>
                    <input
                    spellCheck={false}
                    className={styles.customerInput}
                    type="text"
                    placeholder="Customer Number"
                    value={customer.customerNumber}
                    onChange={(e) =>
                    handleCustomerChange(index, "customerNumber", e.target.value)
                    }
                />
                </div>
                    <FontAwesomeIcon
                     icon={faClose}
                     className={styles.deleteRow}
                     onClick={()=>deleteCustomer(index)}
                     />
            </div>
            )})
        }
    <button
    ref={rowRef} 
    onClick={addCustomer}
    className={styles.addCustomerButton}
    >Add Customer
    </button>

    </div>
    <div className={styles.submitCustomerCol}>
        <CustomButton
        content="Submit"
        element="input"
        className={styles.submitButton}
        onClick={()=>submitCustomers()}
        />
    </div>
    </div>
    )
}
