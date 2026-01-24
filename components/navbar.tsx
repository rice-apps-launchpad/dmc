import Link from "next/link"
import { Button } from "./ui/button"

export default function Navbar(){
    return(
        <div className = "flex flex-row justify-end items-center h-[104px] text-white padding-top[54px] padding-bottom[54px] padding-left[32px] padding-right[32px] bg-[#222D65] gap-[10px]">
            
            <div className = "flex flex-row text-right items-center h-[48px] font-bold font-[20px] gap-[91px]">
                DMC 
            </div>
            <div className = "flex flex-row justify-end items-center h-[44px] font-[36px] gap-[91px] ">

            <Link href = {"admin/sumbmissions"}>
                <button>Submissions</button>
            </Link>

            <Link href = {"admin/forms"}>
                <button>Forms</button>
            </Link>

            <div className ="flex flex-row items-center justify end h-[48px] gap-[12px] border-radius[17]">
                <Link href = {"admin/home"}>
                     <Button style={{backgroundColor: "#B20000"}}>Logout</Button>
                </Link>
            </div>

            
            </div>
  
        </div>
        
    )
}

