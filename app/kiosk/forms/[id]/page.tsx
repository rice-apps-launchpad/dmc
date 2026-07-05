'use client'
import { Suspense, useEffect, useState } from 'react'
import { getForm } from "@/lib/actions/forms";
import { createSubmission } from "@/lib/actions/submissions";
import { CheckoutForm, CheckoutFormValues, TForm } from "@/components/CheckoutForm";
import {useRouter} from "next/navigation"
import { useParams } from 'next/navigation'


async function fetchFormData(id: number) {
  return await getForm(id);
}

function SuspendedFormPage() {
  const { id } = useParams<{ id: string }>()
  const numericId = Number(id)
  const [form, setForm] = useState<TForm>({title: "", description: "", equipment_labels: [], equipment_images: [], category: ""});

  const router = useRouter();


  useEffect(() => {
    async function getFormData() {

      const data = await fetchFormData(numericId);
      if (data) {
        setForm(data);
      }
    }
    getFormData();
  }, [numericId])

  async function handleSubmit(values: CheckoutFormValues) {
    await createSubmission({
      netid: values.netId,
      dueDate: values.dueDate,
      dueTime: values.dueTime,
      checkoutStaff: values.staffName,
      checkoutResponses: values.equipmentStatuses.map(s => s === "Present"),
      title: form.title,
      equipmentLabels: form.equipment_labels,
      equipmentImages: form.equipment_images,
      category: form.category,
      description: form.description,
    });

    setTimeout(() => router.push("/kiosk"), 2000);
  }

  return <CheckoutForm form={form} onSubmit={handleSubmit} />
}

export default function FormPage() {
  return (
    <Suspense>
      <SuspendedFormPage />
    </Suspense>
  )
}
