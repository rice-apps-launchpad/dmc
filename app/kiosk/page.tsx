'use client'

import { useState } from 'react';
import Navbar from "@/components/navbar";
import {
  Combobox,
  ComboboxCollection,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxGroup,
  ComboboxInput,
  ComboboxItem,
  ComboboxLabel,
  ComboboxList,
  ComboboxSeparator,
} from "@/components/ui/combobox";
import data from "@/lib/mock_form.json";

const styles = {
    container: {
      flex: 1
    },
    topSection:{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#E7F0Ff",
        height: "80%",
        flexDirection: "column",
        gap: "50px"
    },
    mainText: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexDirection: "column",
        gap: "14px"
    },
    welcomeText: {
        weight: "700",
        fontWeight: "bold",
        fontSize: "48px",
        lineHeight: "100%",
        letterSpacing: "0%",
    },
    formText: {
        weight: "400",
        fontSize: "48px",
        lineHeight: "100%",
        letterSpacing: "0%",
    },
    bottomSection: {
      background: "white",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      height: "20%"
    },
    button: {
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      width: "275px",
      height: "80px",
      border: "1.35px, solid, #222D65",
      padding: "15px",
      gap: "13.5px",
      backgroundColor: "#E7F0FF",
      borderRadius: "13.5px",
      fontSize: "48px",
    },
    combobox: {
      width: "700px"
    }
    
} as const;


const timezones = [
  {
    value: "Americas",
    items: [
      "(GMT-5) New York",
      "(GMT-8) Los Angeles",
      "(GMT-6) Chicago",
      "(GMT-5) Toronto",
      "(GMT-8) Vancouver",
      "(GMT-3) São Paulo",
    ],
  },
  {
    value: "Europe",
    items: [
      "(GMT+0) London",
      "(GMT+1) Paris",
      "(GMT+1) Berlin",
      "(GMT+1) Rome",
      "(GMT+1) Madrid",
      "(GMT+1) Amsterdam",
    ],
  },
  {
    value: "Asia/Pacific",
    items: [
      "(GMT+9) Tokyo",
      "(GMT+8) Shanghai",
      "(GMT+8) Singapore",
      "(GMT+4) Dubai",
      "(GMT+11) Sydney",
      "(GMT+9) Seoul",
    ],
  },
] as const

const titles = [
  {
    value: "Cables and Adapters",
    items: data
  }
]

console.log(data);

export function ComboboxWithGroupsAndSeparator() {
  const [title, setTitle] = useState<{
        id: number;
        title: string;
        description: string;
        equipment_images: string[];
        equipment_labels: string[];
    } | null>(null);

  console.log(title);

  return (
    <Combobox items={titles} itemToStringLabel={(title: {
        id: number;
        title: string;
        description: string;
        equipment_images: string[];
        equipment_labels: string[];
    }) => title.description} value={title} onValueChange={setTitle}>
      <ComboboxInput placeholder="Select the equipment you're looking for." style={styles.combobox}/>
      <ComboboxContent>
        <ComboboxEmpty>No timezones found.</ComboboxEmpty>
        <ComboboxList>
          {(group, index) => (
            <ComboboxGroup key={group.value} items={group.items}>
              <ComboboxLabel>{group.value}</ComboboxLabel>
              <ComboboxCollection>
                {(title) => {
                  // console.log(item.description)
                  return <ComboboxItem key={title.id} value={title}>
                    {title.description}
                  </ComboboxItem>
                }}
              </ComboboxCollection>
              {index < timezones.length - 1 && <ComboboxSeparator />}
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export default function Page() {
  return (
    <>
      <Navbar page="kiosk" />
      <div style={styles.container}>
        <div style={styles.topSection}>
          <div style={styles.mainText}>
              <p style={styles.welcomeText}>Welcome to the DMC!</p>
              <p style={styles.formText}>Please select a form to complete.</p>
          </div>
          <div>
              {<ComboboxWithGroupsAndSeparator />}
          </div>
        </div>
        <div style={styles.bottomSection}>
          <button style={styles.button}>Next</button>
        </div>
      </div>
    </>
  )
}