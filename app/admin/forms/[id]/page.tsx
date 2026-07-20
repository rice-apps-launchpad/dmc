'use client'

import Link from "next/link";
import { Suspense, useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";

type TForm = {
  id: number,
  title: string,
  category: string,
  description: string,
  equipment_labels: string[],
  equipment_images: string[],
}

function PageContent() {
  const { id } = useParams<{ id: string }>();
  const [form, setForm] = useState<TForm | null>(null);

  useEffect(() => {
    async function getForm() {
      const res = await fetch(`/api/forms/${id}`);
      if (res.ok) setForm(await res.json());
    }
    getForm();
  }, [id]);

  if (!form) return null;

  return (
    <div className="flex flex-col gap-[25px] mt-[37px] mx-[47px]">
      <div className="flex flex-row justify-between items-center">
        <div>
          <p className="text-[14px] text-[#7B7B7B] !font-inter">{form.category}</p>
          <p className="text-3xl font-semibold text-[#474747] font-dm-sans">{form.title}</p>
        </div>
        <div className="flex flex-row gap-[15px]">
          <Button variant='outline' className='!bg-[#E7F0FF] !border-[#222D65] !font-inter !font-[400] !text-[#222D65] !rounded-xl !px-[18px] !py-[5px]' asChild>
            <Link href={`/admin/forms/${form.id}/edit`}>Edit</Link>
          </Button>
          <Button variant='outline' className='!bg-white !border-[#B20000] !font-inter !font-[400] !text-[#B20000] !rounded-xl !px-[18px] !py-[5px]' asChild>
            <Link href="/admin/forms">Back</Link>
          </Button>
        </div>
      </div>

      <p className="text-[16px] text-[#474747] !font-inter">{form.description}</p>

      <div className="flex flex-col gap-[12px] mt-[20px]">
        <p className="text-[20px] font-semibold text-[#222D65] font-dm-sans">Equipment</p>
        <div className="flex flex-row flex-wrap gap-[20px]">
          {form.equipment_labels.map((label, index) => (
            <div key={index} className="flex flex-col items-center w-[220px]">
              <div className="w-[220px] h-[220px] border-2 border-[#222D65] rounded-[20px] overflow-hidden flex items-center justify-center">
                {form.equipment_images[index] && (
                  <img src={form.equipment_images[index]} alt={label} className="w-full h-full object-cover" />
                )}
              </div>
              <p className="text-[14px] text-center mt-[10px] !font-inter text-[#222D65]">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Page() {
  return (
    <Suspense>
      <PageContent />
    </Suspense>
  );
}
