import Image from "next/image";
import Footer from "@/components/partials/footer";
import RegisterClient from "./registerClient";


export default function Register()
{
        return(
        <>
          <header className="landingHeader">
            <div className="imageWrapper">
            <Image src={'/images/dashboard_image.png'}
            alt="A half of clock with a ascending graph representing a standart dashboard logo"
            width={100} height={100} />
            </div>
            <p className="title">C-Board</p>
            </header>
            <RegisterClient/>
             <Footer/>
            </>
        )
}