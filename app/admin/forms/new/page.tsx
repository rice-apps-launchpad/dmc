'use client';
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import { text } from "stream/consumers";
import { ChangeEvent, useState } from 'react';
import Image from 'next/image';
import { useRef } from 'react';


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
        width: "100%",
        gap: "8px",
    }

type Equipment = {
    name?: string;
    image: string;
}

type EquipmentProps = Equipment;



export default function Page() {
    //handle the change of the equipment input
    let [addEquipmentName, setAdd] = useState('');
    let [equipmentImage, setImage] = useState('');
    let [equipList, setEquipList]= useState<Array<Equipment>>([]);
    let [isVisible, setVisible] = useState(false);
    let fileInputRef = useRef<HTMLInputElement>(null);
    let [selectedFile, setSelectedFile] = useState<File | null>(null)
    let [previewUrl, setPreviewUrl] = useState<string | null>(null)
    
    function EquipmentComponent(props: EquipmentProps) {

        function handleAddEquipmentNameChange(e: ChangeEvent<HTMLInputElement>) {
            setAdd(addEquipmentName = e.target.value);
        }

        return (
            <div className = "EquipmentComponent">
                <Button style={{width: "20px", height: "5px", borderRadius: "50%", backgroundColor: "#ff7949", border: "2px solid #222D65", color: "#222D65", display: "flex", alignItems: "center", justifyContent: "center"}} onClick ={handleDelete}>X</Button>
    
                <h1>{props.name}</h1>
                {props.image && (
                    <img src={props.image} alt={props.name} style={{ width: "300px", height: "300px", padding: "8px", border: "2px solid #222D65", }} />
                )}
                
                <input className ="font-medium border-2 border-[#222D65] p-2 rounded-lg align-center" placeholder="Equipment Label" value={addEquipmentName} onChange={handleAddEquipmentNameChange}  />
                
            </div>
        )
    }


    const openFilePicker = () => {
    
        fileInputRef.current?.click()

    };

    const handleFileSelected = (e: React.ChangeEvent<HTMLInputElement>) => {
       const file = e.target.files?.[0]
    
        if (file) {
            const previewUrl = URL.createObjectURL(file);
            setEquipList(prev => [...prev, { image: previewUrl }])
            setVisible(true);
        }
    }

    function handleDelete(){
        setEquipList(equipList => equipList.slice(0, -1));
    }
    
    function handleEquipmentImageChange(e: ChangeEvent<HTMLInputElement>) {
        setImage(equipmentImage = e.target.value);
    }

    function handleSubmitEquipment() {
        if(!addEquipmentName.trim()) return;
        const newEquip = {
            name: addEquipmentName,
            image: equipmentImage
        };

        setEquipList(equipList => [...equipList, newEquip])
        setAdd('');
        setImage('');
        setVisible(false);
    }


    return(
        <div className = "flex flex-col h-full p-8 justify-between gap-10">
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
                   
                   {/*add equipment button*/}
                    <div className="flex w-full items-center flex-row gap-4">
                        
                    {/*label*/}
                            <div className = "flex flex-row flex-wrap gap-4"> 
                                {
                                equipList.map((equipment, idx) =>  <div key={idx} className="border-2 border-[#222D65] p-2 rounded-lg h-[400px]"> <EquipmentComponent key={idx} name={equipment.name} image={equipment.image }/> </div>)
                                }
                                
                                <div>
                                    <input ref={fileInputRef} type="file" onChange={handleFileSelected} style={{border: "2px dashed #B0B0B0", padding: "8px 12px", borderRadius:"10px", height:"400px", alignItems: "center"}}  className="hidden"/>

                                    <div className="flex flex-col flex-end gap-4"> 
                                        <button type="button" onClick = {openFilePicker} className="flex flex-col items-center justify-center border-2 border-dashed border-[#B0B0B0] rounded-[10px] h-[400px] w-[350px] gap-2" >
                                            <span className = "text-sm font-large text-[#222D65]">Add a new Equipment</span>
                                            <Image src = "/formkit_add.png" alt="icon" height = {40} width ={40}/>
                                        </button>
                                    </div> 
                                    
                                </div>
                            </div>             
                            
                    </div>

                {isVisible && (
                    <div className = "flex justify-end mt-10  pt-4">
                        {/*submit button*/}
                        <Button  style={{backgroundColor: "#E7F0FF", height: "50px", width:"120px",border: "2px solid #222D65", color: "#222D65"}} onClick={handleSubmitEquipment}>Submit</Button>
    
                    </div>
                )}
            </div>
        </div>)
}