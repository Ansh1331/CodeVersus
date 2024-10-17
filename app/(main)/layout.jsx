import Navbar from "@/components/navbar"
import sideImg from "@/assets/side.svg";
import Image from "next/image";
import CornerSVG from "@/components/cornersvg";

export default function App({ children }) {
    return (
        <>
            <Navbar />
            <div className="absolute top-11 -z-10">
                <Image src={sideImg} alt="Side decoration" />
            </div>
            {children}
            <CornerSVG />
        </>
    )
}