//import Navbar from "@/components/navbar";
'use client';
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input";
//import {useState, useEffect} from 'react';
import { text } from "stream/consumers";
import { ChangeEvent, useState } from 'react';
import Image from 'next/image';


const inputstyles = {
    boxShadow: "0 0 5px #222D65",
    border: "2px solid #222D65",
    testColor: "#222D65",
    height: "80px",
    color: "#222D65",
    fontsize: "18px",
    borderRadius:"10px",

}

const EquipmentContainer = {
        display: "flex",
        flexDirection: "column" as "column",
        alignItems: "center",
        padding: "8px",
        border: "solid 2px black",
        borderRadius: "8px",
        width: "100%"
    }

type Equipment = {
    name: string;
    image?: string;
}

type EquipmentProps = Equipment;

function EquipmentComponent(props: EquipmentProps) {
    return (
        <div className = "EquipmentComponent">
            <h1>{props.name}</h1>
            {props.image && (
                <img src={props.image} alt={props.name} style={{ width: "300px", height: "300px" }} />
            
            )}</div>
    )
}


export default function Page() {
    //handle the change of the equipment input
    let [addEquipmentName, setAdd] = useState('');
    let [equipmentImage, setImage] = useState('');
    let [equipList, setEquipList]= useState<Array<Equipment>>([]);
    let [isVisible, setVisible] = useState(false);

    function handleAddEquipmentNameChange(e: ChangeEvent<HTMLInputElement>) {
        setAdd(addEquipmentName = e.target.value);
    }

    function handleEquipmentImageChange(e: ChangeEvent<HTMLInputElement>) {
        setImage(equipmentImage = e.target.value);
    }

    function handleAddEquip() {
        const newEquip = {
            name: addEquipmentName,
            image: equipmentImage
        };
        setVisible(!isVisible);

        setEquipList(equipList => [...equipList, newEquip])
        //hobbyList.push(newHobby);
        setAdd('');
        setImage('');
    }
    function handleFileChange(e: ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setImage(previewUrl);
        }
    }
    return(
        <div className = "flex flex-col h-full p-8 justify-between gap-8">
            <div>
                {/*title*/}
                <h1 className="text-2xl font-bold mb-4 text-[#474747]">New Form</h1>
            </div>
            <div className="flex flex-row gap-8">
                <div className = "flex flex-col flex-1">
                    {/*form*/}
                    <h3 className ="text-lg font-bold font-large mb-2 text-[#222D65]">Title</h3>
                    <Input style = {inputstyles} placeholder="Add your title here." />
                    
                </div>
                <div className = "flex flex-col flex-1">
                    <h3 className ="text-lg font-bold  font-large mb-2 text-[#222D65]">Description</h3>
                    <Input style = {inputstyles} placeholder="Add your description here."/>
                </div>
            </div>
            <div className = "flex flex-col gap-8 padding-8">
                    {/*add equipment*/}
                    <h3 className ="text-lg font-bold font-medium mb-2 text-[#222D65]">Add Equipment</h3>
                
                <div className = "flex flex-row gap-8">
                    {/*add new equipment button thing*/}
                    {isVisible && (
                        <div className = "flex flex-col gap-4">
                            <input style={inputstyles} placeholder="Equipment Label" value={addEquipmentName} onChange={handleAddEquipmentNameChange}  />
                                {/* input style={inputstyles} placeholder="Equipment Image" value={equipmentImage} onChange={handleEquipmentImageChange} /> */}
                            <Field>
                                <Input type="file" style={{border: "2px dashed #B0B0B0", padding: "8px 12px", borderRadius:"10px", height:"50px", alignItems: "center"}} onChange={handleFileChange}/>
                            </Field>
                        </div>
                    )}
                   
                    <div className="flex w-full flex-row items-center gap-4">
                        
                            {
                            equipList .filter((item) => item.name && item.name.trim() !== "") .map((equipment, idx) =>  <div key={idx} className="border-2 border-[#222D65] p-2 rounded-lg"> <EquipmentComponent key={idx} name={equipment.name} image={equipment.image }/> </div>)
                            }
                        
                        <button style={{border: "2px dashed #B0B0B0", padding: "8px 12px", borderRadius:"10px", height:"100px", alignItems: "center"}} onClick={handleAddEquip}>
                            <Image src = "/formkit_add.png" alt="icon" height = {20} width ={20}/>{isVisible? "Save Equipment" : "Add Equipment"}</button>
                    </div>
                    
                </div>

        
                <div className = "flex justify-end mt-10  pt-4">
                    {/*submit button*/}
                    <Button  style={{backgroundColor: "#E7F0FF", outline: "0 0 10px #222D65", color: "#222D65"}}>Submit</Button>
                    
                </div>
            </div>
        </div>)
}