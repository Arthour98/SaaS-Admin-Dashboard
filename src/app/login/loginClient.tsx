"use client";
import Main from "@/components/partials/main";
import Link from "next/link";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleArrowLeft } from "@fortawesome/free-solid-svg-icons";
import { useRouter } from "next/navigation";
import SignIn from "@/components/elements/oauth-signin";

export default function LoginClient({})
{
        const router = useRouter();
        const handleBack = ()=>
        {
            router.push('/');
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
            <form id="loginForm">
                <label>
                    Email:
                </label>
                <input type="text" placeholder="Email" />
                <label>
                    Password:
                </label>
                <input type="password" placeholder="********"/>
                <div className="flex w-[100%] justify-end items-end gap-3">
                    <Link href={"/register"} className="text-white underline">Not registered yet?</Link>
                    <input type="submit" value="Sign in" />
                </div>
            </form>
             <SignIn/>
        </div>
        </Main>
    )
}