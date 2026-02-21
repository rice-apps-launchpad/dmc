'use client'
import { use } from 'react'

import mockFormData from "@/lib/mock_form.json"
import {
  Combobox,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
} from "@/components/ui/combobox"

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
      //flex: "1 1 100%"
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
    image: string[]
}

const frameworks = ["Not Selected", "Present", "Not Present"]

export function ExampleCombobox() {
  return (
    <Combobox items={frameworks}>
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

function EquipmentList({label, image}: EquipmentProps){
    return(
        <div className="flex flex-column align-center gap-[100px] justify-start items-center flex-wrap">
            {label.map((label, index) => (
            <div key={index}>
                <div className="flex items-center justify-center w-[30vh] h-[19vh] border-black border-[1px] rounded-[16px] mb-[10px] mt-[10px]">
                <img className="h-[100%]" src={image[index]} alt={label} /> </div>
                <p className="text-[24px] mb-[10px] mt-[5px]">{label}</p>
                <div>
                  {<ExampleCombobox />}
                </div>
            </div>
        ))}
        </div>
    )
}
export default function FormPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const {id} =  use(params)
  const numericId = Number(id)
  const form = mockFormData.find(item => item.id === numericId)
  
 
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
                <EquipmentList image={form?.equipment_images ?? []} label={form?.equipment_labels ?? []}/>
            </div>
            <h1 className=" mt-[65px] font-bold text-[24px] mb-[15px]">Other</h1>
            <div style={styles.otherSection}>
              <p className="text-[24px]">NetId <br /><input style={styles.input} type="text" placeholder="Add your NetId"></input></p>
              <p className="text-[24px]">Due Date <br /><input style={styles.input} type="date" placeholder="Calendar Picker"></input></p>
              <p className="text-[24px]">Due Time <br /><input style={styles.input} type="time" placeholder="Time Picker"></input></p>
              <p className="text-[24px]">DMC Staff Member's Name <br /><input style={styles.input} type="text" placeholder="Add DMC Member's Name"></input></p>
            </div>
        </div>
        <hr className="h-[1px] w-full border-[0.5px] border-[#9f9f9f]"></hr>
        <div style={styles.bottomSection}>
            <button style={styles.button}>Submit</button>     
        </div>
    </div>
  )
}
