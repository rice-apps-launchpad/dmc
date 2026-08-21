'use client';

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useRef, ChangeEvent, useEffect } from 'react';
import {CirclePlus} from 'lucide-react';
import {X} from 'lucide-react';
import { Alert, AlertTitle } from '@/components/ui/alert';

type Equipment = {
  name?: string;
  image: string; // /uploads/... path for stored images, blob preview URL for new ones
  file?: File;   // present only for newly added images (not yet uploaded)
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
    <div className="flex flex-col items-left gap-6 w-[315px]">
      <div className="relative h-[355px] pt-[19px] pb-[19px] pr-[21px] pl-[21px] border-2 border-[#222D65] rounded-[20px]">
        {item.image && (
          <img
            src={item.image}
            alt={item.name}
            className="w-full h-full object-contain rounded-md"
          />
        )}

        <Button
          className="absolute -top-3 -right-3 size-[35px] rounded-full bg-[#B20000] text-white border border-[#222D65] flex items-center justify-center shrink-0 leading-none z-10"
          onClick={handleDelete}
        ><X color="white" size={30} /></Button>
      </div>
      <input
        type="text"
        className="font-regular text-[#222D65] border-2 border-[#222D65] bg-white w-full h-[56px] p-2 rounded-[20px] text-center"
        placeholder="Add your label of the equipment."
        value={item.name || ""}
        onChange={(e) => handleNameChange(e.target.value)}
      />
    </div>
  );
}

/** The payload handed to onSave — matches the /api/forms request body. */
export type FormEditorInput = {
  title: string;
  category: string;
  description: string;
  equipment_labels: string[];
  equipment_images: string[];
};

/** Prefill values for editing an existing form. */
export type FormEditorInitial = {
  title: string;
  category: string;
  description: string;
  equipment: { name: string; image: string }[];
};

/**
 * The form editor used by both the new-form and edit-form pages. Uploads any
 * newly added images, then hands the complete form payload to onSave (which
 * creates or updates the form and navigates away).
 */
export function FormEditor({ heading, initial, onSave }: {
  heading: string;
  initial?: FormEditorInitial;
  onSave: (input: FormEditorInput) => Promise<void>;
}) {
  const [equipList, setEquipList] = useState<Equipment[]>(
    () => initial?.equipment.map((e) => ({ name: e.name, image: e.image })) ?? []
  );
  const [title, setTitle] = useState(initial?.title ?? '');
  const [description, setDescription] = useState(initial?.description ?? '');
  const [category, setCategory] = useState(initial?.category ?? '');
  const [missingFields, setMissingFields] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!initial) {
      setTitle('');
      setDescription('');
      setCategory('');
      setMissingFields(false);
      setEquipList([]);
    }
  },[]);

  const openFilePicker = () => {
    fileInputRef.current?.click();
  };

  const handleFileSelected = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const previewUrl = URL.createObjectURL(file);
      setEquipList((prev) => [...prev, { image: previewUrl, file: file }]);

      e.target.value =""; // Reset the file input for future uploads
    }
  };

  const handleSubmit = async () => {
    // Accessories themselves are optional, but every field that is present —
    // including the label of any added accessory — must be filled out.
    if (!title.trim() || !category.trim() || !description.trim() || equipList.some((e) => !e.name?.trim())) {
      setMissingFields(true);
      return;
    }
    setMissingFields(false);

    const uploadResults = await Promise.all(
      equipList.map(async (equip, index) => {
        if (!equip.file) return equip.image; // already stored; keep its path
        const formData = new FormData();
        formData.append('file', equip.file);
        const res = await fetch('/api/upload', { method: 'POST', body: formData });
        if (!res.ok) throw new Error(`Upload failed for image ${index}`);
        const { path } = await res.json();
        return path as string;
      })
    );

    await onSave({
      title,
      category,
      description,
      equipment_labels: equipList.map((e) => e.name ?? ""),
      equipment_images: uploadResults,
    });
  };

  return (
    <div className="flex flex-col h-full p-8 pl-12">
      <h1 className="text-[32px] font-bold mb-4 text-[#474747]">{heading}</h1>

      {/* Category */}

        <div className="flex flex-col mb-4">
          <h3 className="text-[25px] font-bold mb-1 text-[#222D65]">Category</h3>
          <Input value={category} onChange={(e) => setCategory(e.target.value)} placeholder="Add your category here." className="border-2 border-[#222D65] text-[#222D65] font-bold px-4 pt-2 pb-8 rounded-[20px] h-20 text-lg mb-4 w-[calc(50%-16px)]"/>

        </div>

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
        <h3 className="text-[25px] font-bold mb-1 text-[#222D65]">Add Equipment Accessories</h3>

        <div className="flex flex-row flex-wrap flex-1 gap-6">
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
                Add an
                <span className="block">accessory.</span>
              </span>
                <CirclePlus color="grey" size={40} />
            </button>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      <div className="flex justify-end items-center gap-4 mt-10">
        {missingFields && (
          <Alert className='w-fit rounded-md border-l-6 border-red-600 bg-red-600/10 text-red-600 dark:border-red-400 dark:bg-red-400/10 dark:text-red-400'>
            <AlertTitle className="text-center">Please fill out all fields.</AlertTitle>
          </Alert>
        )}
        <Button
          style={{ backgroundColor: "#E7F0FF", height: "50px", width: "120px", border: "2px solid #222D65", color: "#222D65" }}
          className="mb-4"
          onClick={handleSubmit}>Submit</Button>
      </div>
    </div>
  );
}
