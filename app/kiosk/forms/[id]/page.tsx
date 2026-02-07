//'use client'

import mockFormData from "@/lib/mock_form.json"

const styles = {
    page: {
        flex: 1,
        display: "flex",
        alignItems: "center",
        flexDirection: "column",
        height: "100%",
        fontFamily: "DM Sans"
    },
    formTitle:{
        display:"flex",
        alignItems: "flex-start",
        justifyContent: "center",
        height: "17.5vh",
        width: "100%",
        flexDirection: "column",
        backgroundColor:"#e7f0ff",
    },
    middleSection:{
        height:"65vh",
        width:"95%",
        display: "flex",
        flexDirection: "column",
        flex: 1
    },
}
type EquipmentProps = {
    label: string[],
    image: string[]
}

function EquipmentList({label, image}: EquipmentProps){
    return(
        <div className="flex flex-column align-center gap-[100px] justify-start items-center flex-wrap">
            {label.map((label, index) => (
            <div key={index}>
                <div className="flex items-center justify-center  border-black border-[1px] rounded-[5px]">
                <img className="h-[100%]" src={image[index]} alt={label} /> </div>
                <p className="text-[24px]">{label}</p>
            </div>
        ))}
        </div>
    )
}
export default async function FormPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const {id} = await params
  const numericId = Number(id)
  const form = mockFormData.find(item => item.id === numericId)
  
 
  return (
    <div style={styles.page}>
        <div style={styles.formTitle}>
            <div className="w-[95%]">
                <h1 className="font-bold text-[36px]">{form.title}</h1>
                <p className="text-[24px]">{form.description}.</p>
            </div>
        </div>
        <div style={styles.middleSection}>
            <h1 className="font-bold text-[24px]">Equipment Details</h1>
            <div>
                <EquipmentList image={form.equipment_images} label={form.equipment_labels}/>
            </div>

        </div>
        <div>

        </div>
    </div>
  )
}
