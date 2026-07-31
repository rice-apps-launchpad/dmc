'use client'

import Link from "next/link";
import { useEffect, useState } from "react";
import { SearchBar } from "@/components/SearchBar";
import { Button } from "@/components/ui/button";
import { TableRow } from "@/components/TableRow";

type TForm = {
  id: number,
  title: string,
  description: string,
}

async function formsData(): Promise<TForm[]> {
  const res = await fetch('/api/forms')
  return res.json()
}

type Props = {
    data: TForm[],
    onDelete: (id: number) => void,
}

function PageContent(props: Props) {
    return (
        props.data.map((form) => (
            <TableRow key={form.id}>
                <div className='flex justify-center items-center h-full'>
                    <div className='mx-[40px] grid grid-cols-[1fr_2fr_250px] items-center gap-4 w-full'>
                        <p className="whitespace-nowrap text-[14px] !font-inter !font-[400]">{form.title}</p>
                        <p className='whitespace-nowrap text-[14px] !font-inter !font-[400]'>{form.description}</p>
                        <div className='flex flex-row justify-between items-center gap-[15px]'>
                            <Button variant='outline' className='!bg-[#E7F0FF] !border-[#222D65] !font-inter !font-[400] !text-[#222D65] !rounded-xl !px-[18px] !py-[5px]' asChild>
                                <Link href={`forms/${form.id}`}>View</Link>
                            </Button>
                            <Button variant='outline' className='!bg-[#E7F0FF] !border-[#222D65] !font-inter !font-[400] !rounded-xl !px-[18px] !py-[5px]' asChild>
                                <Link href={`forms/${form.id}/edit`}>Edit</Link>
                            </Button>
                            <Button variant='outline' className='!bg-white !border-[#B20000] !font-inter !font-[400] !text-[#B20000] !rounded-xl !px-[18px] !py-[5px]' onClick={() => props.onDelete(form.id)}>Delete</Button>
                        </div>
                    </div>
                </div>
            </TableRow>
        ))
    )
}

export default function Page() {
    const [data, setData] = useState<TForm[]>([]);
    const [filteredData, setFilteredData] = useState<TForm[]>([]);

    useEffect(() => {
        async function getFormsData() {
            const fetchedData = await formsData();
            setData(fetchedData);
            setFilteredData(fetchedData);
        }
        getFormsData();
    }, []);

    function handleSearch(e: React.ChangeEvent<HTMLInputElement>) {
        setFilteredData(data.filter(form => form.title.toLowerCase().includes(e.target.value.toLowerCase())));
    }

    async function handleDelete(id: number) {
        if (!confirm("Delete this form?")) return;
        const res = await fetch(`/api/forms/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            console.error("Delete failed:", await res.text());
            return;
        }
        setData(prev => prev.filter(form => form.id !== id));
        setFilteredData(prev => prev.filter(form => form.id !== id));
    }

    return (
        <div className='flex flex-col gap-[25px]'>
            <div className="mt-[37px]">
                <SearchBar title='Forms' buttonText={<>+ Add a new form</>} link='/admin/forms/new' placeholder="Search by title." searchHandler={handleSearch} />
            </div>
            <div className='flex flex-col !gap-[12px] mx-[47px]'>
                <div className="grid grid-cols-[1fr_2fr_250px] items-center gap-4 rounded-xl bg-[#1f2a63] text-white px-[70px] py-5 text-sm font-medium">
                    <span><strong>Form Title</strong></span>
                    <span><strong>Subtitle</strong></span>
                </div>
                <PageContent data={filteredData} onDelete={handleDelete} />
            </div>
        </div>
    );
}
