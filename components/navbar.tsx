import Link from "next/link"
import { Button } from "./ui/button"

interface NavbarProps {
    page: "admin" | "kiosk";
}

export default function Navbar({ page }: NavbarProps){
    
    let pageTitle;
    if (page === "admin") {
        pageTitle = "Admin";
    } else {
        pageTitle = "Kiosk"
    }

    return(
        <div className = "flex flex-row justify-between items-center h-[104px] w-full text-white px-[32px] bg-[#222D65]">
            
            <div className = "flex flex-row flex-start text-right items-center h-[48px] font-bold text-2xl gap-[100px]">
                DMC {pageTitle}
            </div>

            

            <div className ="flex flex-row items-center h-[48px] gap-[60px]">
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
        
    )
}

