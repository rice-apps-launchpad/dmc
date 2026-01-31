import * as React from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Button } from "@/components/ui/button";
import '@fontsource/dm-sans';
import '@fontsource/inter';

export function SearchBar(text: string) {
    return (
        <div className='px-[47px] py-[47px] gap-[40px] flex flex-col w-full h-auto'>
            <p className='text-3xl font-semibold text-[#474747] font-dm-sans'>Submissions</p>
            <div className='flex flex-row w-full h-[110px] !gap-[10px]'>
                <InputGroup className='w-[87%] h-[40%] !bg-white !rounded-full overflow-hidden'>
                    <InputGroupInput className="!bg-white !font-inter" placeholder="Search by any xxx."/>
                    <InputGroupAddon className="!bg-white">
                        <Search className="" />
                    </InputGroupAddon>
                </InputGroup>
                <Button className='w-[11%] !bg-[#7B7B7B] h-[40%] text-white !rounded-full !font-inter' variant='outline'>Group By: <b><u>NetID</u></b></Button>
            </div>
        </div>
    );
 }