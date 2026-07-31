"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Suspense } from 'react'
import { AvailabilityStatus, EquipmentList } from "@/components/EquipmentList";
import { useParams } from 'next/navigation';
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"

import { useEffect, useState } from "react";
import { TSubmission } from "../../page";
import { useRouter } from "next/navigation";

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
    }
}

type FormInputProps = {
    title: string,
    type: string,
    placeholder: string,
    value: string,
}

function FormInput(props: FormInputProps) {
  return (
    <div className="flex flex-col">
      <p className="text-[24px]" style={{ whiteSpace: 'pre-wrap' }}>{props.title}</p>
      <input style={styles.input} type={props.type} placeholder= {props.placeholder} value={props.value} readOnly></input>
    </div>
  );
}

function CheckInViewContent() {
    const { id } = useParams<{ id: string }>()
    const router = useRouter();

    const [form, setForm] = useState<TSubmission | null>(null);

    useEffect(() => {
        async function fetchSubmission() {
            const res = await fetch(`/api/submissions/${id}`);
            if (!res.ok) return;
            const data: TSubmission = await res.json();
            setForm(data);
        }
        fetchSubmission();
    }, [id]);

    // A submission that hasn't been checked in yet has nothing to view — send
    // staff to the fill-out form instead.
    useEffect(() => {
        if (form && form.status !== "Checked In") {
            router.replace(`/admin/submissions/${id}/check-in/edit`);
        }
    }, [form, id, router]);

    if (!form || form.status !== "Checked In") return null;

    // checkin_responses is stored as "true"/"false" strings in the DB.
    const equipmentResponses = (form.checkin_responses ?? []).map((r) => String(r) === "true" ? "Present" : "Not Present");
    const partsWorking = form.parts_working === null ? "" : form.parts_working ? "Yes" : "No";

    return (
        <div style={styles.page}>
            <div style={styles.formTitle}>
                <div className="w-[95%]">
                    <h1 className="font-bold text-[34px]">{form?.title}</h1>
                    <p className="text-[24px]">{form?.description}.</p>
                </div>
            </div>
            {/* A disabled fieldset makes every input inside it read-only;
                display: contents keeps it out of the layout. */}
            <fieldset disabled className="contents">
            <div style={styles.middleSection}>
                <h1 className="font-bold text-[24px] mb-[10px]">Equipment Details</h1>
                <div>
                    <EquipmentList image={form?.equipment_images ?? []} label={form?.equipment_labels ?? []} statuses={equipmentResponses} onStatusChange={() => {}} />
                </div>
                <div>
                    <h1 className="mt-[65px] text-[24px] mb-[10px]">Were all parts returned in working order?</h1>
                    <div className="w-[40vh]">
                        <AvailabilityStatus items={["Yes", "No"]} value={partsWorking} onChange={() => {}} />
                    </div>
                </div>
                <h1 className="mt-[65px] font-bold text-[24px] mb-[15px]">Notes</h1>
                <div style={styles.otherSection}>
                    <div className = "flex flex-col">
                        <FormInput title={"Description (optional)                                        "}
                        type={"text"} placeholder={'Enter description here'} value={form.checkin_description ?? ""} />
                    </div>
                    <div className="flex flex-row gap-[100px] items-start">
                        <FormInput title={"DMC Staff Member's Name"} type={"text"} placeholder={'Add DMC Member\'s name'} value={form.checkin_staff ?? ""} />
                        <div className="flex flex-col mt-[44px] h-[50px] justify-center">
                            <FieldGroup className="mx-auto w-56">
                                <Field orientation="horizontal" className="flex items-center gap-3">
                                    <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" className= "h-[30px] w-[30px]" checked/>
                                    <FieldLabel htmlFor="terms-checkbox-bassic" className="text-[24px]">
                                        Scan In
                                    </FieldLabel>
                                </Field>
                            </FieldGroup>
                        </div>
                    </div>
                </div>
                <p className="mt-2 text-[18px] self-start">
                    <strong className="italic">Please remember to format the memory card and charge the battery if less than 70% (if applicable)</strong>
                </p>
            </div>
            </fieldset>
            <hr className="h-[1px] w-full border-[0.5px] border-[#9f9f9f]"></hr>
            <div style={styles.bottomSection} className="flex-col">
                <button style={styles.button} onClick={() => router.back()}>Back</button>
            </div>
        </div>
    );
}

export default function CheckInViewPage() {
    return (
        <Suspense>
            <CheckInViewContent />
        </Suspense>
    );
}
