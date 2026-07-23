'use client'
import { Suspense, useEffect, useState } from 'react'
import { CheckoutForm, TForm } from "@/components/CheckoutForm";
import { useParams } from 'next/navigation'

function SuspendedViewPage() {
  const { id } = useParams<{ id: string }>()
  const [form, setForm] = useState<TForm>({title: "", description: "", equipment_labels: [], equipment_images: [], category: ""});

  useEffect(() => {
    async function getFormData() {
      const res = await fetch(`/api/forms/${id}`);
      if (!res.ok) return;
      setForm(await res.json());
    }
    getFormData();
  }, [id])

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
