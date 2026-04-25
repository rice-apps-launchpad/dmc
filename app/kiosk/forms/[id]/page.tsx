'use client'
import { Suspense, use, useEffect, useState } from 'react'
import { createClient } from "@/lib/supabase/client";
import {useRouter} from "next/navigation"
import { Alert, AlertTitle } from '@/components/ui/alert'


async function fetchFormData(id: number) {
  const supabase = createClient();
  const {data: formData} = await supabase.from("forms").select().eq("id", id).single()
  return formData
}

async function getImageUrl(path: string) {
  const supabase = createClient();
  const { data } = await supabase.storage.from("equipment_images").getPublicUrl(path);
  return data.publicUrl
}

import mockFormData from "@/lib/mock_form.json"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"
import { useParams } from 'next/navigation'
import { Form } from '@base-ui/react'

const styles = {
  page: {
    flex: 1,
    display: "flex",
    alignItems: "center",
    flexDirection: "column" as "column",
    maxHeight: "100vh",
    width: "100%",
    fontFamily: "DM Sans",
    backgroundColor: "#ffffff",
  },
  formTitle: {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flexDirection: "column" as "column",
    backgroundColor: "#e7f0ff",
    paddingTop: "2vw",
    paddingBottom: "2vw",
  },
  middleSection: {
    width: "95%",
    display: "flex",
    flexDirection: "column" as "column",
    paddingTop: "2vw",
    flex: "1 1 100%",
    paddingBottom: "2vw",
  },
  otherSection:{
    display: "flex",
    justifyContent: "flex-start",
    alignItems: "center",
    columnGap: "100px",
    rowGap: "40px",
    flexWrap: "wrap" as "wrap",
  },
  input:{
    backgroundColor: "#ffffff",
    width: "100%",
    padding: "15px",
    border: "1px solid #000000",
    borderRadius: "15px",
    fontSize: "16px",
    margin: "8px 0",
  },
   bottomSection: {
      background: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "20vh",
    },
    button: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "220px",
      height: "64px",
      border: "1.35px, solid, #222D65",
      padding: "15px",
      gap: "13.5px",
      backgroundColor: "#E7F0FF",
      borderRadius: "13.5px",
      fontSize: "36px",
      margin: "20px"
    },
    combobox: {
      height: "64px",
      backgroundColor: "#000000",
    }
}
type EquipmentProps = {
    label: string[],
    image: string[],
    statuses: string[],
    onStatusChange: (index: number, value: string) => void
}

type FormInputProps = {
    title: string,
    type: string,
    placeholder: string,
    value: string,
    onChange: (value: string) => void
}

const frameworks = ["Present", "Not Present"]

type AvailabilityStatusProps = { value: string; onChange: (value: string) => void }

function AvailabilityStatus({ value, onChange }: AvailabilityStatusProps) {
  return (
    <Combobox items={frameworks} value={value} onValueChange={(val) => onChange(val ?? "")}>
      <ComboboxInput placeholder="Not Selected" style={styles.combobox}/>
      <ComboboxContent>
        <ComboboxEmpty>No items found.</ComboboxEmpty>
        <ComboboxList>
          {(item) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

const AlertIndicatorSuccessDemo = () => {
  return (
    <Alert className='rounded-md border-l-6 border-green-600 bg-green-600/10 text-green-600 dark:border-green-400 dark:bg-green-400/10 dark:text-green-400'>
      <AlertTitle className="text-center">Form submitted successfully.</AlertTitle>
    </Alert>
  )
}

const AlertIndicatorMissingDemo = () => {
  return (
    <Alert className='rounded-md border-l-6 border-red-600 bg-red-600/10 text-red-600 dark:border-red-400 dark:bg-red-400/10 dark:text-red-400'>
      <AlertTitle className="text-center">Please fill out all fields.</AlertTitle>
    </Alert>
  )
}
const AlertIndicatorInternalErrorDemo = () => {
  return (
    <Alert className='rounded-md border-l-6 border-red-600 bg-red-600/10 text-red-600 dark:border-red-400 dark:bg-red-400/10 dark:text-red-400'>
      <AlertTitle className="text-center">Internal error occurred. Please try again.</AlertTitle>
    </Alert>
  )
}

function EquipmentList({label, image, statuses, onStatusChange}: EquipmentProps){
    return(
        <div className="flex flex-column align-center gap-[100px] justify-start items-center flex-wrap">
            {label.map((label, index) => (
            <div key={index}>
                <div className="flex items-center justify-center w-[30vh] h-[19vh] border-black border-[1px] rounded-[16px] mb-[10px] mt-[10px]">
                <img className="h-[100%]" src={image[index]} alt={label} /> </div>
                <p className="text-[24px] mb-[10px] mt-[5px]">{label}</p>
                <div>
                  <AvailabilityStatus value={statuses[index]} onChange={(val) => onStatusChange(index, val)} />
                </div>
            </div>
        ))}
        </div>
    )
}
function FormInput(props: FormInputProps) {
  return (
    <div className="flex flex-col">
      <p className="text-[24px]">{props.title}</p>
      <input style={styles.input} type={props.type} placeholder={props.placeholder} value={props.value} onChange={(e) => props.onChange(e.target.value)}></input>
    </div>
  );
}

type TForm = {
  title: string,
  description: string,
  equipment_labels: string[],
  equipment_images: string[],
  category: string
}


function SuspendedFormPage() {
  const { id } = useParams<{ id: string }>()
  const numericId = Number(id)
  const [form, setForm] = useState<TForm>({title: "", description: "", equipment_labels: [], equipment_images: [], category: ""});
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [netId, setNetId] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [staffName, setStaffName] = useState("");
  const [equipmentStatuses, setEquipmentStatuses] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [missingFields, setMissingFields] = useState(false);
  const [internalError, setInternalError] = useState(false);

  const router = useRouter();


  useEffect(() => {
    async function getFormData() {
      
      const data = await fetchFormData(numericId);
      setForm(data);
      setEquipmentStatuses(new Array(data.equipment_labels.length).fill(""));
    }
    getFormData();
  }, [setForm, fetchFormData, numericId])

  useEffect(() => {
    async function fetchImageUrls() {
      const urls = await Promise.all(
        form?.equipment_images?.map(async (image: string) => await getImageUrl(image)) ?? []
      );

      setImageUrls(urls);
    }
    fetchImageUrls();
  }, [form?.equipment_images, setImageUrls, getImageUrl]) 

  async function handleSubmit(buttonElement: HTMLButtonElement) {
  setClicked(true);
  buttonElement.disabled = true;

  if (!netId || !dueDate || !dueTime || !staffName || equipmentStatuses.includes("")) {
    setMissingFields(true);
    setInternalError(false);
    setSubmitted(false);
    buttonElement.disabled = false;
    return;
  }
  setMissingFields(false);

  const supabase = createClient();
  const { error } = await supabase.from("submissions").insert({
    netid: netId,
    due_date: dueDate,
    due_time: dueTime,
    checkout_staff: staffName,
    checkout_responses: equipmentStatuses.map(s => s === "Present"),
    title: form.title,
    equipment_labels: form.equipment_labels,
    equipment_images: form.equipment_images,
    category: form.category,
    description: form.description,
    status: "Checked Out",
  });

  if (error) {
    console.log("Error submitting form:", error);
    setInternalError(true);
    setSubmitted(false);
    buttonElement.disabled = false;

  } else {
    setSubmitted(true);
    setTimeout(() => router.push("/kiosk"), 2000);
  }}
  return (
    <div style={styles.page}>
        <div style={styles.formTitle}>
            <div className="w-[95%]">
                <h1 className="font-bold text-[34px]">{form?.title}</h1>
                <p className="text-[24px]">{form?.description}.</p>
            </div>
        </div>
        <div style={styles.middleSection}>
            <h1 className="font-bold text-[24px]">Equipment Details</h1>
            <div>
                <EquipmentList
                  image={imageUrls}
                  label={form?.equipment_labels ?? []}
                  statuses={equipmentStatuses}
                  onStatusChange={(index, val) => setEquipmentStatuses(prev => {
                    const updated = [...prev];
                    updated[index] = val;
                    return updated;
                  })}
                />
            </div>
            <h1 className=" mt-[65px] font-bold text-[24px] mb-[15px]">Other</h1>
            <div style={styles.otherSection}>
              <FormInput title={"NetId"} type={"text"} placeholder={'Add your NetId'} value={netId} onChange={setNetId}/>
              <FormInput title={"Due Date"} type={"date"} placeholder={'Calendar Picker'} value={dueDate} onChange={setDueDate}/>
              <FormInput title={"Due Time"} type={"time"} placeholder={'Time Picker'} value={dueTime} onChange={setDueTime}/>
              <FormInput title={"DMC Staff Member's Name"} type={"text"} placeholder={"Add DMC Member's Name"} value={staffName} onChange={setStaffName}/>
            </div>
        </div>
        <hr className="h-[1px] w-full border-[0.5px] border-[#9f9f9f]"></hr>
        {clicked &&submitted && (
          <div className="w-[40%] mb-4, mt-4">
            <AlertIndicatorSuccessDemo />
          </div>
        )}
        {missingFields && (
          <div className="w-[40%] mb-4, mt-4">
            <AlertIndicatorMissingDemo />
          </div>
        )}
        {internalError && clicked && !submitted && (
          <div className="w-[40%] mb-4, mt-4">
            <AlertIndicatorInternalErrorDemo />
          </div>
        )}
        <div style={styles.bottomSection}>
            <button style={styles.button} onClick={(e) => handleSubmit(e.currentTarget)}>
                Submit
            </button>
        </div>
    </div>
  )
}

export default function FormPage() {
  return (
    <Suspense>
      <SuspendedFormPage />
    </Suspense>
  )
}
