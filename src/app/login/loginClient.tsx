"use client";
import Main from "@/components/partials/main";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import SignIn from "@/components/elements/oauth-signin";
import { useState } from "react";
import CustomButton from "@/components/elements/customButton";
import { useQuery } from "@/lib/use-query";

export default function LoginClient({})
{
    const router = useRouter();
    const handleBack = ()=>
    {
        router.push('/');
    }
    const [isLoading,setIsLoading] = useState(false);

    const [email,setEmail]= useState("");
    const [password,setPassword]= useState("");

    const submitLogin = async(e:React.FormEvent<HTMLFormElement>)=>
    {
        e.preventDefault();
        setIsLoading(true);
        const payload = 
        {
            email:email,
            password:password
        }
        try
        {
            const res = await useQuery("auth/login",{method:"post",body:payload});

            if(res)
            {
                setIsLoading(false);
            }
            if(res.user.verified_at == null)
            {
                router.push('/auth-verification');
            }
            else
            {
                router.push('/dashboard');
            }
        }
        catch(e)
        {
            console.error(e);
            setIsLoading(false);
        }
    }


    return(
        <Main className="loginMain">
        <div className="loginWrapper">
            <FontAwesomeIcon icon={faCircleArrowLeft}
            width="24px"
            color="white"
            cursor="pointer"
            onClick={handleBack}/>
            <h3 className="formTitle">Signup</h3>
            <form id="loginForm" onSubmit={(e)=>submitLogin(e)}>
                <label>
                    Email:
                </label>
                <input value={email} onChange={(e)=>setEmail(e.target.value)} type="text" placeholder="Email" />
                <label>
                    Password:
                </label>
                <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" placeholder="********"/>
                <div className="flex flex-col w-[100%] justify-center items-center lg:flex-row gap-3">
                    <Link href={"/register"} className="text-white underline">Not registered yet?</Link>
                    <div className="flex w-[100%] justify-center lg:w-[30%] items-center gap-3">
                        <SignIn/>
                        <p className="text-white mx-1">OR</p>
                        <CustomButton isLoading={isLoading} element="input" content="Sign in" />
                    </div>
                </div>
            </form>
             
        </div>
        </Main>
    )
}