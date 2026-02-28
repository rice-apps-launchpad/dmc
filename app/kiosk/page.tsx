'use client'

import { useState } from 'react';
import Link from "next/link";



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

const titles = [
  {
    value: "Cables and Adapters",
    items: data
  }
]

export function ComboboxWithGroupsAndSeparator({
  selectedTitle,
  setSelectedTitle,
}: {
  selectedTitle: typeof data[0] | null;
  setSelectedTitle: React.Dispatch<React.SetStateAction<typeof data[0] | null>>;
}) {
  return (
    <Combobox items={titles} itemToStringLabel={(title: typeof data[0]) => title.description} onValueChange={(value) => setSelectedTitle(value)}>
      <ComboboxInput placeholder="Select the equipment you're looking for." style={styles.combobox}/>
      <ComboboxContent>
        <ComboboxEmpty>No equipment found.</ComboboxEmpty>
        <ComboboxList>
          {(group) => (
            <ComboboxGroup key={group.value} items={group.items}>
              <ComboboxLabel>{group.value}</ComboboxLabel>
              <ComboboxCollection>
                {(title) => (
                  <ComboboxItem key={title.id} value={title}>
                    {title.description}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export default function Page() {
  const [selectedTitle, setSelectedTitle] = useState<typeof data[0] | null>(null);

  return (
      <div style={styles.container}>
        <div style={styles.topSection}>
          <div style={styles.mainText}>
              <p style={styles.welcomeText}>Welcome to the DMC!</p>
              <p style={styles.formText}>Please select a form to complete.</p>
          </div>
          <div>
              {<ComboboxWithGroupsAndSeparator selectedTitle={selectedTitle}
            setSelectedTitle={setSelectedTitle}/>}
          </div>
        </div>
        <div style={styles.bottomSection}>
          <Link href={selectedTitle ?`/kiosk/forms/${selectedTitle.id}`: "#"}>
            <button disabled={!selectedTitle} style={styles.button}>Next</button>
            </Link>
        </div>
      </div>
  )
}