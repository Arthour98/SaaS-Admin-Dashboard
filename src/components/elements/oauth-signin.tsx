
"use client"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {faGoogle} from "@fortawesome/free-brands-svg-icons";
import { signIn } from "next-auth/react"
 
export default function SignIn() {
  return <button onClick={() => signIn("google")}><FontAwesomeIcon icon={faGoogle}/></button>
}