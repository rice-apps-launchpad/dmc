import Link from "next/link"
import { Button } from "./ui/button"

interface NavbarProps {
    page: "admin" | "kiosk";
}

export default function Navbar({ page }: NavbarProps){
    
    let pageTitle;
    if (page === "admin") {
        pageTitle = "Admin";
    } else if (page === "kiosk") {
        pageTitle = "Kiosk"
    }

    return(
        <div className = "flex justify-center items-center text-white bg-[#222D65] w-full shadow-lg">
            <div className="w-full px-[47px] h-[86px] flex flex-row justify-between items-center">
                <div className = "flex flex-row flex-start text-right items-center h-[48px] font-bold text-3xl gap-[100px]">
                    DMC {pageTitle}
                </div>

                <div className ="flex flex-row items-center gap-[90px]">
                    {page === "admin" && (
                        <>
                            <Link href = {"admin/submissions"}>
                                <button>Submissions</button>
                            </Link>

                            <Link href = {"admin/forms"}>
                                <button>Forms</button>
                            </Link>
                        </>
                    )}
                    <Link href = {"/"}>
                        <Button style={{backgroundColor: "#B20000"}}>Logout</Button>
                    </Link>
                </div>
            </div>
        </div>
        
    )
}

