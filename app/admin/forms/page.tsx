import * as React from 'react';
import Link from "next/link";
import { SearchBar } from "@/components/ui/HeaderSearch";
import { Button } from "@/components/ui/button";
import Navbar from "@/components/navbar";
import mockData from '@/lib/mock_form.json';

type TextBarProps = {
    title: string,
    description: string,
    id: number
}

function TextBar(props : TextBarProps) {
    return <div>
        <div className='rounded-3xl border bg-white mx-[47px] h-[55px] px-6 gap-[200px] flex justify-center'>
            <div className='mx-[40px] grid grid-cols-[1fr_2fr_250px] items-center gap-4 w-full'>
                <p className="whitespace-nowrap text-[14px] !font-inter !font-[400]">{props.title}</p>
                <p className='whitespace-nowrap text-[14px] !font-inter !font-[400]'>{props.description}</p>
                <div className='flex flex-row justify-between items-center gap-[15px]'>
                    <Button variant='outline' className='!bg-[#E7F0FF] !border-[#222D65] !font-inter !font-[400] !text-[#222D65] !rounded-xl !px-[18px] !py-[5px]' asChild>
                        <Link href={`forms/${props.id}`}>View</Link>
                    </Button>
                    <Button variant='outline' className='!bg-[#E7F0FF] !border-[#222D65] !font-inter !font-[400] !rounded-xl !px-[18px] !py-[5px]' asChild>
                        <Link href={`forms/${props.id}/edit`}>Edit</Link>
                    </Button>
                    <Button variant='outline' className='!bg-white !border-[#B20000] !font-inter !font-[400] !text-[#B20000] !rounded-xl !px-[18px] !py-[5px]'>Delete</Button>
                </div>
            </div>
        </div>
    </div>;
}

export default function Page() {
    return (
        <div className='flex flex-col gap-[25px]'>
            <div className='mb-[12px]'>
                <Navbar page='admin'></Navbar>
            </div>
            <SearchBar title='Forms' buttonText={<>+ Add a new form</>} link='/admin/forms/new'></SearchBar>
            <div className='flex flex-col !gap-[12px]'>
                <div className="grid grid-cols-[1fr_2fr_250px] items-center gap-4 mx-[47px] rounded-xl bg-[#1f2a63] text-white px-[70px] py-5 text-sm font-medium">
                    <span><strong>Form Title</strong></span>
                    <span><strong>Description</strong></span>
                </div>
                {mockData.map((form) => (
                    <TextBar key={form.id} id={form.id} title={form.title} description={form.description}></TextBar>
                ))}
            </div>
        </div>
    );
}