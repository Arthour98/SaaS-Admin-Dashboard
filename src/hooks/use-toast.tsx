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
        case "error": ()=>toast.error(message); break;
        case "info": ()=>toast.error(message); break;
        case "success": ()=>toast.error(message); break;
        case "warning":()=>toast.error(message); break;
    }
}