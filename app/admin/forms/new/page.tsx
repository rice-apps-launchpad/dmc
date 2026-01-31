//import Navbar from "@/components/navbar";
'use client';
import { Button } from "@/components/ui/button";
import { Field, FieldDescription, FieldLabel } from "@/components/ui/field"
import { Input } from "@/components/ui/input";
import {useState} from 'react';
export default function Page() {
    return(
        <div className = "flex flex-col h-full p-8">
            <div>
                {/*title*/}
                <h1 className="text-2xl font-bold mb-4 text-[#474747]">New Form</h1>
            </div>
            <div className="flex flex-row gap-8">
                <div className = "flex flex-col flex-1">
                    {/*form*/}
                    <h3 className ="text-lg font-bold  font-medium mb-2 text-[#222D65]">Title</h3>
                    <Input placeholder="Add your title here."/>
                    
                </div>
                <div className = "flex flex-col flex-1">
                    <h3 className ="text-lg font-bold  font-medium mb-2 text-[#222D65]">Description</h3>
                    <Input  placeholder="Add your description here."/>
                </div>
            </div>
            <div className = "flex flex-col">
                {/*add equipment*/}
                <h3 className ="text-lg  font-bold font-medium mb-2 text-[#222D65]">Add Equipment</h3>
                <Input  placeholder="Add your label of the equipment here."/>
                <Field>
                    <Input type="file"/>
                </Field>
                
            </div>
            <div>
                {/*submit button*/}
                <Button style={{backgroundColor: "#E7F0FF"}}>Submit</Button>
                
            </div>

        </div>)
}