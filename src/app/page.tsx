import LandingPageClient from "@/app/landingPageClient";
import Image from "next/image";
import Footer from "@/components/partials/footer";
import { User } from "@/services/auth";
import { redirect } from "next/navigation";



export default async function Page() {
  const auth = await User();
  

  if(auth?.user)
  {
    redirect('/dashboard',"replace");
  }


  return (<>
  <header className="landingHeader">
    <div className="imageWrapper">
    <Image src={'/images/dashboard_image.png'}
    alt="A half of clock with a ascending graph representing a standart dashboard logo"
    width={100} height={100} />
    </div>
    <p className="title">C-Board</p>
    </header>
    <LandingPageClient/>
     <Footer/>
    </>
  );
}
