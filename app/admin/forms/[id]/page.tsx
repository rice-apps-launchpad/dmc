'use client'
import { Suspense, useEffect, useState } from 'react'
import { getForm } from "@/lib/actions/forms";
import { CheckoutForm, TForm } from "@/components/CheckoutForm";
import { useParams } from 'next/navigation'

function SuspendedViewPage() {
  const { id } = useParams<{ id: string }>()
  const numericId = Number(id)
  const [form, setForm] = useState<TForm>({title: "", description: "", equipment_labels: [], equipment_images: [], category: ""});

  useEffect(() => {
    async function getFormData() {
      const data = await getForm(numericId);
      if (data) {
        setForm(data);
      }
    }
    getFormData();
  }, [numericId])

  // No onSubmit: the form is shown exactly as kiosk users see it, but read-only.
  return <CheckoutForm form={form} />
}

export default function FormViewPage() {
  return (
    <Suspense>
      <SuspendedViewPage />
    </Suspense>
  )
}
