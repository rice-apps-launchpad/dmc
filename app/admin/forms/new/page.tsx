'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import Image from 'next/image';
import { useState, useRef, ChangeEvent } from 'react';
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
    <div className="flex flex-col items-left rounded-lg h-[357px] w-[350px] ">
      <div style={{position: "relative", display: "inline-block" }} >
        {item.image && (
            <img
            src={item.image}
            alt={item.name}
            style={{ width: "337px", height: "255px", paddingTop: "29px", paddingBottom: "29px", paddingLeft: "31px", paddingRight: "31px", border: "2px solid #222D65", marginBottom: "10px", borderRadius: "12px", objectFit: "cover", display:"block"
            }}
            />
        )}
        <Button 
            style={{
                position: "absolute",
                top: "10px",
                right: "10px",
                width: "28px",
                height: "28px",
                minWidth: "28px",
                borderRadius: "50%",
                backgroundColor: "#B20000",
                color: "#ffffff",
                padding: 0,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                border: "1px solid #ffffff",
                cursor: "pointer",
                zIndex: 2
            }}
            onClick={handleDelete}
        >X</Button>
      </div>

        <input
            type="text"
            className="font-weight bold font-medium border-2 border-[#222D65] w-[300px] h-[86px] p-2 rounded-lg text-center"
            placeholder="Equipment Label"
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
    }
  };

  const handleSubmit = () => {
    console.log("Title:", title);
    console.log("Description:", description);
    console.log("Equipment:", equipList);
    alert("Submitted! Check console for data.");
  };

  return (
    <div className="flex flex-col h-full p-8 gap-10">
      <h1 className="text-2xl font-bold mb-4 text-[#474747]">New Form</h1>

      {/* Title & Description */}
      <div className="flex flex-row gap-8">

        <div className="flex flex-col flex-1">
          <h3 className="text-lg font-bold mb-2 text-[#222D65]">Title</h3>
          <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Add your title here." className="border-2 border-[#222D65] font-bold px-2 pt-2 pb-8 rounded-lg h-20 text-lg"/>
          
        </div>
        <div className="flex flex-col flex-1">
          <h3 className="text-lg font-bold mb-2 text-[#222D65]">Description</h3>
          <Input value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Add your description here." className="border-2 border-[#222D65] font-bold px-2 pt-2 pb-8 rounded-lg h-20 text-lg"/>
        
        </div>
      </div>

      {/* Add Equipment */}
      <div className="flex flex-col gap-4">
        <h3 className="text-lg font-bold mb-2 text-[#222D65]">Add Equipment</h3>

        <div className="flex flex-row flex-wrap gap-4">
          {equipList.map((equipment, idx) => (
            <EquipmentComponent key={idx} index={idx} item={equipment} setEquipList={setEquipList} />
          ))}

          {/* Add new equipment button */}
          <div>
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleFileSelected} className="hidden"/>
            <button
              type="button"
              onClick={openFilePicker}
              className="flex flex-col items-center justify-center border-2 border-dashed border-[#B0B0B0] rounded-lg h-[357px] w-[337px] gap-2"
            >
              <span className="text-sm font-medium text-[#222D65]">
                Add a new Equipment
              </span>
              <Image src="/formkit_add.png" alt="icon" width={40} height={40} />
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