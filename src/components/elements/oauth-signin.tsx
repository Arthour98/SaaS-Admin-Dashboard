
"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import { signIn } from "next-auth/react"
 
export default function SignIn() {

  const handleGoogleSignIn = async () => {
    await signIn("google", {
      callbackUrl: "/dashboard",
    });
  };
  return( 
  <button
   name={"google_auth"}
  onClick={handleGoogleSignIn}>
      <FontAwesomeIcon color="white"
       icon={faGoogle}/>
  </button>
  )
}