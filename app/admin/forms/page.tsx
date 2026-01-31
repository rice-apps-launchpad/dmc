import * as React from 'react';
import { SearchBar } from "@/components/ui/HeaderSearch";

type TextBarProps = {
    title: string,
    description: string
}

function TextBar(props : TextBarProps) {
    <div className='rounded-xl border bg-white'>
        <span>{props.title}</span>
        <span>{props.description}</span>
    </div>
}

export default function Page() {
    return (
        <div className='flex flex-col gap-[25px]'>
            <SearchBar title='Forms' buttonText={<>+ Add a new form</>}></SearchBar>
            <div className="grid grid-cols-5 gap-4 mx-[47px] items-center rounded-xl bg-[#1f2a63] text-white px-4 py-5 text-sm font-medium">
                <span className="text-left pl-7">Form Title</span>
                <span className="text-center pl-7">Description</span>
            </div>
            <TextBar title='PER CELLPHONE-TRIPOD' description='Cellphone to Tripod Adapter and Bluetooth Shutter Remote'></TextBar>
        </div>
    );
}