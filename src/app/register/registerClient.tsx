"use client";
import Main from "@/components/partials/main";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import SignIn from "@/components/elements/oauth-signin";
import { useState } from "react";
import CustomButton from "@/components/elements/customButton";

export default function RegisterClient({})
{
    const router = useRouter();
    const handleBack = ()=>
    {
        router.push('/');
    }

    const [isLoading,setIsLoading] = useState(false);

    return(
    <Main className="registerMain">
        <div className="registerWrapper">
            <FontAwesomeIcon icon={faCircleArrowLeft}
                width="24px"
                color="white"
                cursor="pointer"
                onClick={handleBack}/>
            <h3 className="formTitle">Signup</h3>
            <form id="loginForm">
                <label>
                    Email:
                </label>
                <input type="text" placeholder="Email" />
                <label>
                    Username:
                </label>
                <input type="text" placeholder="Username" />
                <label>
                    Password:
                </label>
                <input type="password" placeholder="********"/>
                <div className="flex w-[100%] justify-center items-end gap-3">
                    <Link className="underline text-white" href="/login">Already registered?</Link>
                    <div className="flex w-[30%] justify-center items-center gap-3">
                        <SignIn/>
                        <p className="text-white mx-1">OR</p>
                        <CustomButton isLoading={isLoading} element="input" content="Sign up" />
                    </div>
                </div>
            </form>
            
        </div>
    </Main>
    )
}