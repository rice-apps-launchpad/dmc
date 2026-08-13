'use client'
import { useEffect, useState } from 'react'
import { Alert, AlertTitle } from '@/components/ui/alert'
import { Checkbox } from "@/components/ui/checkbox"
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field"
import { useRouter } from 'next/navigation'
import { EquipmentList } from "@/components/EquipmentList"

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
    onChange: (value: string) => void
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

function FormInput(props: FormInputProps) {
  return (
    <div className="flex flex-col">
      <p className="text-[24px]">{props.title}</p>
      <input style={styles.input} type={props.type} placeholder={props.placeholder} value={props.value} onChange={(e) => props.onChange(e.target.value)}></input>
    </div>
  );
}

export type TForm = {
  title: string,
  description: string,
  equipment_labels: string[],
  equipment_images: string[],
  category: string
}

/** The values a user fills in when checking out equipment. */
export type CheckoutFormValues = {
  netId: string,
  name: string,
  dueDate: string,
  dueTime: string,
  staffName: string,
  equipmentStatuses: string[],
}

/**
 * The checkout form for a Form's equipment. When onSubmit is provided (kiosk),
 * the Submit button and result alerts are shown; when omitted (admin view),
 * the form is display-only: inputs are disabled and a Back button replaces
 * Submit.
 */
export function CheckoutForm({ form, onSubmit, initialValues }: {
  form: TForm,
  onSubmit?: (values: CheckoutFormValues) => Promise<void>,
  /** Prefill for viewing an existing submission; overrides the clock defaults. */
  initialValues?: CheckoutFormValues,
}) {
  // equipment_images holds ready-to-serve /uploads/... paths.
  const imageUrls = form?.equipment_images ?? [];
  const [netId, setNetId] = useState("");
  const [name, setName] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [dueTime, setDueTime] = useState("");
  const [staffName, setStaffName] = useState("");
  // Not stored in the database — required purely so staff confirm the
  // equipment was actually scanned out before submitting.
  const [scannedOut, setScannedOut] = useState(false);
  const [equipmentStatuses, setEquipmentStatuses] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);
  const [clicked, setClicked] = useState(false);
  const [missingFields, setMissingFields] = useState(false);
  const [internalError, setInternalError] = useState(false);

  const router = useRouter();

  // The form arrives after an async fetch in the parent page, so reset the
  // per-equipment statuses whenever the equipment list changes.
  useEffect(() => {
    setEquipmentStatuses(new Array(form?.equipment_labels?.length ?? 0).fill(""));
  }, [form?.equipment_labels?.length])

  // Default the due date to a week from now and the due time to the current
  // time. Set in an effect (not useState initializers) so the prerendered
  // HTML doesn't bake in a stale clock and mismatch on hydration.
  useEffect(() => {
    const pad = (n: number) => String(n).padStart(2, "0");
    const now = new Date();
    const due = new Date(now);
    due.setDate(due.getDate() + 7);
    setDueDate(`${due.getFullYear()}-${pad(due.getMonth() + 1)}-${pad(due.getDate())}`);
    setDueTime(`${pad(now.getHours())}:${pad(now.getMinutes())}`);
  }, [])

  // Prefill from an existing submission once it arrives (declared after the
  // effects above so these values win over the resets/defaults they apply).
  useEffect(() => {
    if (!initialValues) {
      setSubmitted(false);
      setNetId("");
      setName("");
      setStaffName("");
      setScannedOut(false);
      setClicked(false);
      return;
    }
    setNetId(initialValues.netId);
    setName(initialValues.name);
    setDueDate(initialValues.dueDate);
    setDueTime(initialValues.dueTime);
    setStaffName(initialValues.staffName);
    setEquipmentStatuses(initialValues.equipmentStatuses);
  }, [initialValues])

  async function handleSubmit(buttonElement: HTMLButtonElement) {
  if (!onSubmit) return;
  setClicked(true);
  buttonElement.disabled = true;

  if (!netId || !name || !dueDate || !dueTime || !staffName || !scannedOut || equipmentStatuses.includes("")) {
    setMissingFields(true);
    setInternalError(false);
    setSubmitted(false);
    buttonElement.disabled = false;
    return;
  }
  setMissingFields(false);

  try {
    await onSubmit({ netId, name, dueDate, dueTime, staffName, equipmentStatuses });

    setSubmitted(true);
  } catch (error) {
    console.log("Error submitting form:", error);
    setInternalError(true);
    setSubmitted(false);
    buttonElement.disabled = false;
  } finally {
    buttonElement.disabled = false;
  }
  }
  return (
    <div style={styles.page}>
        <div style={styles.formTitle}>
            <div className="w-[95%]">
                <h1 className="font-bold text-[34px]">{form?.title}</h1>
                <p className="text-[24px]">{form?.description}.</p>
            </div>
        </div>
        {/* A disabled fieldset makes every input inside it read-only in view
            mode; display: contents keeps it out of the layout. */}
        <fieldset disabled={!onSubmit} className="contents">
        <div style={styles.middleSection}>
            <h1 className="font-bold text-[24px] mb-[10px]">Equipment Details</h1>
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
              <div className="flex flex-row gap-[40px] text-[30px]">
                <FormInput title={"Full Name"} type={"text"} placeholder={'Add your Name'} value={name} onChange={setName}/>
                <FormInput title={"NetId"} type={"text"} placeholder={'Add your NetId'} value={netId} onChange={setNetId}/>
              </div>
            </div>
            <h1 className=" mt-[20px] font-bold text-[24px] mb-[15px]">Staff</h1>
            <div style={styles.otherSection}>
              <div className="flex flex-row gap-[40px] text-[30px]">

                <FormInput title={"Due Date"} type={"date"} placeholder={'Calendar Picker'} value={dueDate} onChange={setDueDate}/>
                <FormInput title={"Due Time"} type={"time"} placeholder={'Time Picker'} value={dueTime} onChange={setDueTime}/>
                <FormInput title={"DMC Staff Member's Name"} type={"text"} placeholder={"Add DMC Member's Name"} value={staffName} onChange={setStaffName}/>
                <div className="flex flex-col mt-[44px] h-[50px] justify-center">
                    <FieldGroup className="mx-auto w-56">
                        <Field orientation="horizontal" className="flex items-center gap-3"> {/* items-center helps align large text with checkbox */}
                            <Checkbox id="terms-checkbox-basic" name="terms-checkbox-basic" className= "h-[30px] w-[30px]" checked={scannedOut} onCheckedChange={(checked) => setScannedOut(checked === true)}/>
                            <FieldLabel htmlFor="terms-checkbox-bassic" className="text-[24px]">
                                Scan Out
                            </FieldLabel>
                        </Field>
                    </FieldGroup>
                </div>
              </div>
            </div>


          </div>
        </fieldset>
        <hr className="h-[1px] w-full border-[0.5px] border-[#9f9f9f]"></hr>
        {onSubmit && (
          <>
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
          </>
        )}
        {!onSubmit && (
          <div style={styles.bottomSection}>
              <button style={styles.button} onClick={() => router.back()}>
                  Back
              </button>
          </div> 
        )}
    </div>
  )
}
