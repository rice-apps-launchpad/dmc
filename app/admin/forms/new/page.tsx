'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
// import Image from 'next/image';
import { useState, useRef, ChangeEvent } from 'react';
import {CirclePlus} from 'lucide-react';
import {X} from 'lucide-react';
// import "./ImageOverlay.css";



type Equipment = {
  name?: string;
  image: string;
};

type EquipmentProps = {
  item: Equipment;
  index: number;
  setEquipList: React.Dispatch<React.SetStateAction<Equipment[]>>;
};

function EquipmentComponent({ item, index, setEquipList }: EquipmentProps) {
  const handleNameChange = (value: string) => {
    setEquipList((prev) =>
      prev.map((e, i) => (i === index ? { ...e, name: value } : e))
    );
  };

  const handleDelete = () => {
    setEquipList((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col items-left rounded-lg gap-4 h-[355px] w-[337px]">
      <div className="relative w-[315px] flex-1 pt-[19px] pb-[19px] pr-[21px] pl-[21px] border-2 border-[#222D65] rounded-[20px]">
        {item.image && (
            <img
              src={item.image}
              alt={item.name}
              className="h-[315px] w-[337px] w-object-cover rounded-md"
            />
        )}

        <Button
          className="absolute -top-3 -right-3 size-[35px] rounded-full bg-[#B20000] text-white border border-[#222D65] flex items-center justify-center shrink-0 leading-none z-10"
          onClick={handleDelete}
        ><X color="white" size={30} /></Button>
      </div>

        <input
            type="text"
            className="font-regular text-[#222D65] border-2 border-[#222D65] bg-white w-[315px] h-[86px] p-2 rounded-[20px] text-center"
            placeholder="Add your label of the equipment."
            value={item.name || ""}
            onChange={(e) => handleNameChange(e.target.value)}
        />
    </div>
  );
}

export default function Page() {
  const [equipList, setEquipList] = useState<Equipment[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  const fileInputRef = useRef<HTMLInputElement>(null);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setEquipList((prev) => [...prev, { image: previewUrl }]);

      e.target.value =""; // Reset the file input for future uploads
    }
  };

  const handleSubmit = () => {
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Equipment:", equipList);
    alert("Submitted! Check console for data.");
  };

  return (
    <div className="flex flex-col h-full p-8 pl-12">
      <h1 className="text-[32px] font-bold mb-4 text-[#474747]">New Form</h1>

      {/* Title & Description */}
      <div className="flex flex-row gap-8">

        <div className="flex flex-col flex-1">
          <h3 className="text-[25px] font-bold mb-1 text-[#222D65]">Title</h3>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add your title here." className="border-2 border-[#222D65] text-[#222D65] font-bold px-4 pt-2 pb-8 rounded-[20px] h-20 text-lg"/>
          
        </div>
        <div className="flex flex-col flex-1">
          <h3 className="text-[25px]  font-bold mb-1 text-[#222D65]">Subtitle</h3>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add your description here." className="border-2 border-[#222D65] text-[#222D65] font-bold px-4 pt-2 pb-8 rounded-[20px] h-20 text-lg"/>
        
        </div>
      </div>

      {/* Add Equipment */}
      <div className="flex flex-col gap-4 mt-14">
        <h3 className="text-[25px] font-bold mb-1 text-[#222D65]">Add Equipment Accessory</h3>

        <div className="flex flex-wrap  gap-y-20">
            {equipList.map((equipment, idx) => (
            <EquipmentComponent key={idx} index={idx} item={equipment} setEquipList={setEquipList} />
          ))}
          {/* Add new equipment button */}
          <div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelected} className="hidden"/>
            <button
              type="button"
              onClick={openFilePicker}
              className="flex flex-col items-center justify-center border-2 border-dashed border-[#B0B0B0] rounded-[20px] h-[357px] w-[315px] gap-2"
            >
              <span className="text-[20px] font-bold text-[#5C5C5C]">
                Add a new
                <span className="block">equipment.</span>
              </span>
                <CirclePlus color="grey" size={40} />
            </button>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      {equipList.length > 0 && (
        <div className="flex justify-end mt-10">
          <Button
            style={{ backgroundColor: "#E7F0FF", height: "50px", width: "120px", border: "2px solid #222D65", color: "#222D65", }}
            onClick={handleSubmit}>Submit</Button>
        </div>
      )}
    </div>
  );
}