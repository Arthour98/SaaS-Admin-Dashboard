import {useState,useRef,useEffect, useMemo, useCallback} from "react"
import styles from "@/components/main.module.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {  faClose, faFileCsv } from "@fortawesome/free-solid-svg-icons";
import InfoItem from "../elements/info-item";
import CustomButton from "../elements/customButton";
import { useQuery } from "@/lib/use-query";
import { useRouter } from "next/navigation";
import { OrgProps, UserProps } from "@/app/dashboard/page";
import { CustomerProps } from "@/app/dashboard/customers/customersClient";
import { useToast } from "@/hooks/use-toast";

export default function AddCustomerLayout(
{current_layout,customers,user,organization}:
{
  current_layout:boolean,
  customers :CustomerProps[],
  user:UserProps,
  organization:OrgProps
})
{
const rowRef = useRef<HTMLButtonElement | null>(null);
const fileInputRef = useRef<HTMLInputElement | null>(null);
const [loadingSubmit,setLoadingSubmit] = useState(false);
const router = useRouter();

type Customer = {
customer_name: string;
phone_number: string;
};
 // Renaming customers to _customers so it wont conflict with the passing prop
 const [_customers, setCustomers] = useState<Customer[]>([
  {
    customer_name: "",
    phone_number: "",
  },
    ]);

useEffect(()=>
{
  if(!current_layout)
  {
    setCustomers([
  {
    customer_name: "",
    phone_number: "",
  },
    ])
  }
},[current_layout])

const addCustomer = () => {
  setCustomers((prev) => [
    ...prev,
    {
      customer_name: "",
      phone_number: "",
    },
  ]);
};

let deleteCustomer = useCallback((index:number) => {
    const new_customers = _customers.filter((cus:Customer)=>
    _customers.indexOf(cus) !== index)
    setCustomers(new_customers);
},[customers]);

useEffect(() => {
  rowRef.current?.scrollIntoView({
    behavior: "smooth",
    block: "end",
  });
}, [_customers.length]);

const handleCustomerChange = (index:number, field:keyof Customer,value:string) => {
  setCustomers((prev) => {
    const updated = [...prev];
    updated[index][field] = value;
    return updated;
  });
};

const triggerFileInput = ()=>
{
  const fileInput = fileInputRef.current;
  if(fileInput)
  {
    fileInput.click();
  }
}


const handleChange = async (
  event: React.ChangeEvent<HTMLInputElement>
) => {
  const file = event.target.files?.[0];
  console.log(file);

  if (!file) return;

  const text = await file.text();
  const array_csv = text.split(/,|\n/);
  const properties = array_csv.splice(0,2); 
  
  const mappedObj: any[] =[];
  let external_counter = 0;
  for(let i=0 ; i<Math.floor(array_csv.length/2);i++)
  {
    const obj : any = {}
    let counter = 0;

   for(let key of properties)
   {
    obj[`${key}`] = array_csv[i+counter+external_counter];
    if(counter==0)
    {
      counter+=1
    }
    else if(counter>=1)
    {
      counter=0; //reset to 0 if we reach 1 cause we have 2 properties only
    }
   }
    external_counter+=1;
    mappedObj.push(obj);
  }
  if(mappedObj)
  {
    setCustomers(mappedObj)
  }
};


const submitCustomers = async(e:React.MouseEvent)=>
{
  e.preventDefault();
  setLoadingSubmit(true);
  const data = 
  {
    customers:_customers,
    organization_id:organization.organization_id
  }
  try
  {
    let res;
    if(_customers.length===1)
    {
    res = await useQuery("customers/create",{method:"post",body:data})
    }
    else
    {
      res= await useQuery("customers/bulk-create",{method:"post",body:data})
    }
    if(res.data.status=="success")
    {
      setLoadingSubmit(false);
      router.refresh();
      setCustomers([
      {
        customer_name: "",
        phone_number: "",
      },
        ])
      useToast({
        type:"success",
        message:"Customer created succesfully"
      })
    }
    else if(res.data.status="failed")
    {
      setLoadingSubmit(false);
    }
  }
  catch(e)
  {
    console.error("[ClIENT_ERROR]",e)
    setLoadingSubmit(false)
  }
}
    

if(!current_layout)
{
    return null;
}
return(
<div className={styles.createCustomersLayout}>
    <div className={styles.csvCol}>
        <InfoItem content="Import CSV with headers: customer_name, phone_number"/>
        <FontAwesomeIcon 
        className={styles.csvIcon}
        icon={faFileCsv}
        onClick={triggerFileInput} />
        <input 
        ref={fileInputRef}
        type="file"
        className={styles.fileInput}
        onChange={(e)=>handleChange(e)}
        />
    </div>
    <div className={styles.addCustomerCol}>
        {_customers.map((customer, index) =>{
        return (
            
            <div key={index} className={styles.customerRow}>
                <div className={styles.customerNameCol}>
                    <label className={styles.labelSpace}>Name</label>
                    <input
                    spellCheck={false}
                    className={styles.customerInput}
                    type="text"
                    placeholder="Customer Name"
                    value={customer.customer_name}
                    onChange={(e) =>
                    handleCustomerChange(index, "customer_name", e.target.value)
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
                    value={customer.phone_number}
                    onChange={(e) =>
                    handleCustomerChange(index, "phone_number", e.target.value)
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
        element="button"
        isLoading={loadingSubmit}
        className={styles.submitButton}
        onClick={(e)=>submitCustomers(e)}
        />
    </div>
    </div>
    )
}
