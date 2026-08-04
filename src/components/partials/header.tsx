
import Image from "next/image"
import MobileNav from "./mobile-nav"

export default function Header({showMenu}
    :
    {
        showMenu?:boolean
    }
) {



return(
<header className="landingHeader">
    <div className="headerRow">   
        <div className="imageWrapper">
            <Image src={'/images/dashboard_image.png'}
            alt="A half of clock with a ascending graph representing a standart dashboard logo"
            width={100} height={100} />
        </div>
        <p className="title">C-Board</p>
    </div>
    {
        showMenu &&
        <MobileNav/>
    }
</header>
)
}