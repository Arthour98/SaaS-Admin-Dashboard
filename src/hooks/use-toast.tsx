import {toast} from "react-toastify";

type toastProps = 
{
    type : "error" | "info" | "success" | "warning",
    message : string
}
export const useToast=({type,message}:toastProps)=>
{
    switch(type)
    {
        case "error": toast.error(message); break;
        case "info": toast.info(message); break;
        case "success": toast.success(message); break;
        case "warning":toast.warning(message); break;
    }
}