'use client'

import { useEffect, useState } from 'react';
import Link from "next/link";
import { createClient } from "@/lib/supabase/client";

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

type TTitle = {
    id: number;
    category: string;
    title: string;
    description: string;
};

export function ComboboxWithGroupsAndSeparator({
  setSelectedTitle,
}: {
  setSelectedTitle: React.Dispatch<React.SetStateAction<TTitle['id'] | null>>;
}) {
  // fetch titles
  const supabase = createClient();
  const [titles, setTitles] = useState<TTitle[]>([]);
  useEffect(() => {
      const fetchTitles = async () => {
          const { data, error } = await supabase.from("forms").select("id, category, title, description");
          if (error) {
              console.error("Error fetching titles:", error);
          } else {
              setTitles(data);
          }
      };
      fetchTitles();
  }, []);

  // group titles by category
  const grouped = titles.reduce((acc: Record<string, TTitle[]>, title) => {
    if (!acc[title.category]) {
      acc[title.category] = [];
    }
    acc[title.category].push(title);
    return acc;
  }, {});
  
  return (
    <Combobox items={titles} 
              itemToStringLabel={(title: TTitle) => title.description} 
              onValueChange={(title) => setSelectedTitle(title?.id ?? null)}>
      <ComboboxInput placeholder="Select the equipment you're looking for." style={styles.combobox}/>
      <ComboboxContent>
        <ComboboxEmpty>No equipment found.</ComboboxEmpty>
        <ComboboxList>
          {Object.entries(grouped).map(([category, items]) => (
            <ComboboxGroup key={category} items={items}>
              <ComboboxLabel>{category}</ComboboxLabel>
              <ComboboxCollection>
                {(title: TTitle) => (
                  <ComboboxItem key={title.id} value={title}>
                    {title.description}
                  </ComboboxItem>
                )}
              </ComboboxCollection>
            </ComboboxGroup>
          ))}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  )
}

export default function Page() {
  const [selectedTitle, setSelectedTitle] = useState<TTitle['id'] | null>(null);

  return (
      <div style={styles.container}>
        <div style={styles.topSection}>
          <div style={styles.mainText}>
              <p style={styles.welcomeText}>Welcome to the DMC!</p>
              <p style={styles.formText}>Please select a form to complete.</p>
          </div>
          <div>
              {<ComboboxWithGroupsAndSeparator setSelectedTitle={setSelectedTitle}/>}
          </div>
        </div>
        <div style={styles.bottomSection}>
          <Link href={selectedTitle ?`/kiosk/forms/${selectedTitle}`: "#"}>
            <button disabled={!selectedTitle} style={styles.button}>Next</button>
          </Link>
        </div>
      </div>
  )
}