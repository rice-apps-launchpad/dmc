'use client'
import { Suspense, useEffect, useState } from 'react'
import { CheckoutForm, CheckoutFormValues, TForm } from "@/components/CheckoutForm";
import {useRouter} from "next/navigation"
import { useParams } from 'next/navigation'

function SuspendedFormPage() {
  const { id } = useParams<{ id: string }>()
  const [form, setForm] = useState<TForm>({title: "", description: "", equipment_labels: [], equipment_images: [], category: ""});

  const router = useRouter();

  useEffect(() => {
    async function getFormData() {
      const res = await fetch(`/api/forms/${id}`);
      if (!res.ok) return;
      setForm(await res.json());
    }
    getFormData();
  }, [id])

  async function handleSubmit(values: CheckoutFormValues) {
    const res = await fetch('/api/submissions', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        netid: values.netId,
        name: values.name,
        due_date: values.dueDate,
        due_time: values.dueTime,
        checkout_staff: values.staffName,
        checkout_responses: values.equipmentStatuses.map(s => s === "Present"),
        title: form.title,
        equipment_labels: form.equipment_labels,
        equipment_images: form.equipment_images,
        category: form.category,
        description: form.description,
        status: "Checked Out",
      }),
    });
    // A thrown error surfaces as CheckoutForm's internal-error alert.
    if (!res.ok) throw new Error(await res.text());

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
