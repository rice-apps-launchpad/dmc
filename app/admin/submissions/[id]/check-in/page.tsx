"use client"

import mockFormData from "@/lib/mock_submissions.json";
import { Checkbox } from "@/components/ui/checkbox"
import { createClient } from "@/lib/supabase/client";
import { Suspense } from 'react'
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox";
import { useParams } from 'next/navigation';
import { Form } from '@base-ui/react';
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

// import { useEffect, useState } from "react";
import { useEffect, useState, useCallback, memo } from "react";
import { TSubmission } from "../../page";
import { Input } from "postcss";
import { useRouter } from "next/navigation";
import { UserCheckIcon } from 'lucide-react'
import { Alert, AlertTitle } from '@/components/ui/alert'

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
    responses: string[],
    onResponseChange: (index: number, value: string) => void;
}

type FormInputProps = {
    title: string,
    type: string,
    placeholder: string,
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

type AvailabilityProps = {
    framework: string[],
    value: string,
    onValueChange: (value: string) => void;
}

const AlertIndicatorSuccessDemo = () => {
  return (
    <Alert className='flex justify-center rounded-md border-l-6 border-green-600 bg-green-600/10 text-green-600 dark:border-green-400 dark:bg-green-400/10 dark:text-green-400 w-[340px] mt-[20px] text-[18px]'>
      <AlertTitle className="text-center">Form submitted successfully.</AlertTitle>
    </Alert>
  )
}

const AlertIndicatorMissingDemo = () => {
  return (
    <Alert className='flex justify-center rounded-md border-l-6 border-red-600 bg-red-600/10 text-red-600 dark:border-red-400 dark:bg-red-400/10 dark:text-red-400 w-[340px] mt-[20px]'>
      <AlertTitle className="text-center text-[18px]">Please fill out all fields.</AlertTitle>
    </Alert>
  )
}

function AvailabilityStatus(props: AvailabilityProps) {
    const handleValueChange = useCallback((val: string | null) => {
        const newVal = val ?? '';
        if (newVal !== props.value) {  // ← only call if value actually changed
            props.onValueChange(newVal);
        }
    }, [props.value, props.onValueChange]);

    return (
        <Combobox value={props.value} onValueChange={handleValueChange} items={props.framework}>
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
    );
}

function FormInput(props: FormInputProps) {
  return (
    <div className="flex flex-col">
      <p className="text-[24px]" style={{ whiteSpace: 'pre-wrap' }}>{props.title}</p>
      <input style={styles.input} type={props.type} placeholder= {props.placeholder} onChange={props.onChange}></input>
    </div>
  );
}

function EquipmentList({label, image, responses, onResponseChange}: EquipmentProps){
    return(
        <div className="flex flex-column align-center gap-[100px] justify-start items-center flex-wrap">
            {label.map((label, index) => (
            <div key={index}>
                <div className="flex items-center justify-center w-[30vh] h-[19vh] border-black border-[1px] rounded-[16px] mb-[10px] mt-[10px]">
                <img className="h-[100%] " src={image[index]} alt={label} /> </div>
                <p className="text-[24px] mb-[10px] mt-[5px]">{label}</p>
                <div>
                  {<AvailabilityStatus framework={["Present", "Not Present"]} value={responses[index]} onValueChange={(value) => onResponseChange(index, value)} />}
                </div>
            </div>
        ))}
        </div>
    )
}

function CheckInContent() {
    const { id } = useParams<{ id: string }>()
    const numericId = Number(id)
    const router = useRouter();
  
    const [form, setForm] = useState<TSubmission | null>(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [equipmentResponses, setEquipmentResponses] = useState<string[]>([]);
    const [partsWorking, setPartsWorking] = useState<string>("");
    const [checkinDescription, setCheckinDescription] = useState("");
    const [checkinStaff, setCheckinStaff] = useState("");
    const [showMissingAlert, setShowMissingAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);

    const supabase = createClient();

    const handleEquipmentChange = useCallback((index: number, value: string) => {
        setEquipmentResponses(prev => {
            const newResponses = [...prev];
            newResponses[index] = value;
            return newResponses;
        }); 
    }, []);

    useEffect(() => {
        async function fetchSubmissaion() {

            const { data } = await supabase
                .from("submissions").select("*")
                .eq("id", id).single();
            if (data){
                setForm(data);
                setEquipmentResponses(new Array(data.equipment_labels.length).fill(""));
            }
            
        }

        fetchSubmissaion();
    }, [id]);

    const handleCheckIn = async () => {
        const unansweredEquipment = equipmentResponses.some(res => res === "");
        if (unansweredEquipment || partsWorking === "" || checkinStaff.trim() === "") {
            setShowMissingAlert(true);
            return;
        }
        setShowMissingAlert(false);

        setSubmitting(true);

        const booleanResponses = equipmentResponses.map(res => res === "Present");
        const partsWorkingBoolean = partsWorking === "Yes";
        const { error } = await supabase
            .from("submissions")
            .update({
                checkin_responses: booleanResponses, 
                checkin_staff: checkinStaff,
                checkin_description: checkinDescription,
                parts_working: partsWorkingBoolean,
                status: "Checked In", // Update the status
         })
            .eq("id", id);

        if (error) {
            alert("Error updating record: " + error.message);
            setSubmitting(false);
        } else {
            setShowMissingAlert(false);
            setShowSuccessAlert(true);
            setTimeout(() => {
                router.push("/admin/submissions");
            }, 1500);
        }
        };
    return (
        <Suspense>
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
                        <EquipmentList image={form?.equipment_images ?? []} label={form?.equipment_labels ?? []} responses={equipmentResponses} onResponseChange={handleEquipmentChange} />
                    </div>
                    <div>
                        <h1 className="mt-[30px] text-[24px] mb-[10px]">Were all parts returned in working order?</h1>
                        <div className="w-[40vh]">
                            <AvailabilityStatus framework={["Yes", "No"]} value={partsWorking} onValueChange={setPartsWorking} />
                        </div>
                    </div>
                    <h1 className="mt-[65px] font-bold text-[24px] mb-[15px]">Notes</h1>
                    <div style={styles.otherSection}>
                        <div className = "flex flex-col">
                            <FormInput title={"Description (optional)                                        "} 
                            type={"text"} placeholder={'Enter description here'}/>
                            <p className="mt-2 text-[18px]">
                                <strong className="italic">Please remember to format the memory card and charge the battery if less than 70% (if applicable)</strong>
                            </p>
                        </div>
                        <div className="flex flex-row gap-[100px] items-start">
                            <FormInput title={"DMC Staff Member's Name"} type={"text"} placeholder={'Add DMC Member\'s name'}/>
                            <div className="flex flex-col mt-[44px] h-[50px] justify-center"> 
                                <FieldGroup className="mx-auto w-56">
                                    <Field orientation="horizontal" className="flex items-center gap-3">
                                        <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" className= "h-[30px] w-[30px]"/>
                                        <FieldLabel htmlFor="terms-checkbox-bassic" className="text-[24px]">
                                            Scan In
                                        </FieldLabel>
                                    </Field>
                                </FieldGroup>
                            </div>
                        </div>
                    </div>
                </div>
                <hr className="h-[1px] w-full border-[0.5px] border-[#9f9f9f]"></hr>
                <div style={styles.bottomSection} className="flex-col">
                    {showSuccessAlert && <AlertIndicatorSuccessDemo />}
                    {showMissingAlert && !showSuccessAlert && <AlertIndicatorMissingDemo />}
                    <button style={styles.button} onClick={handleCheckIn} disabled={submitting}>Submit</button>
                </div>
            </div>
        </Suspense>
    );
}

export default function CheckInPage() {
    return (
        <Suspense>
            <CheckInContent />
        </Suspense>
    );
}
