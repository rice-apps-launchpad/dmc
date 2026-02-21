import * as React from 'react';
import Link from "next/link";
import { Search } from 'lucide-react';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import '@fontsource/dm-sans';
import '@fontsource/inter';

type SearchBarProps = {
    title: string,
    buttonText: React.ReactNode,
    link: string
}

export function SearchBar(props : SearchBarProps) {
    return (
        <div className='px-[47px] gap-[40px] flex flex-col w-full h-auto'>
            <p className='text-3xl font-semibold text-[#474747] font-dm-sans'>{props.title}</p>
            <div className='flex flex-row w-full h-[50px] !gap-[10px]'>
                <InputGroup className='w-[87%] h-[100%] !bg-white !rounded-full overflow-hidden'>
                    <InputGroupInput className="!bg-white !font-inter" placeholder="Search by any xxx."/>
                    <InputGroupAddon className="!bg-white">
                        <Search className="" />
                    </InputGroupAddon>
                </InputGroup>
                <Button className='w-[11%] !bg-[#7B7B7B] h-[100%] text-white !rounded-full !font-inter' asChild>
                    <Link href={props.link}>{props.buttonText}</Link>
                </Button>
            </div>
        </div>
    );
 }