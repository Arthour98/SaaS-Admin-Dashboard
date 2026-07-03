import { NavLink } from "../elements/navLink"
import Image from "next/image"
export default function Header({}) {


   
return(
<header className="landingHeader">
    <nav>   
        <div className="imageWrapper">
            <Image src={'/images/dashboard_image.png'}
            alt="A half of clock with a ascending graph representing a standart dashboard logo"
            width={100} height={100} />
        </div>
        <p className="title">C-Board</p>
    </nav>
</header>
)
}