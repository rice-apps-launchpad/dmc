'use client'
import { Suspense, useEffect, useState } from 'react'
import { CheckoutForm, CheckoutFormValues, TForm } from "@/components/CheckoutForm";
import { useParams } from 'next/navigation'
import { TSubmission } from "../page";

function SuspendedViewPage() {
  const { id } = useParams<{ id: string }>()
  // form and values are kept in one state object so initialValues has a stable
  // identity across renders (CheckoutForm's prefill effect is keyed on it).
  const [view, setView] = useState<{ form: TForm, values: CheckoutFormValues } | null>(null);

  useEffect(() => {
    async function getSubmission() {
      const res = await fetch(`/api/submissions/${id}`);
      if (!res.ok) return;
      const s: TSubmission = await res.json();

      // due_time arrives as an ISO timestamp; the time input wants local HH:MM.
      const pad = (n: number) => String(n).padStart(2, "0");
      const due = s.due_time ? new Date(s.due_time) : null;

      setView({
        form: {
          title: s.title,
          description: s.description,
          equipment_labels: s.equipment_labels,
          equipment_images: s.equipment_images,
          category: s.category,
        },
        values: {
          netId: s.netid ?? "",
          name: s.name ?? "",
          dueDate: s.due_date ?? "",
          dueTime: due ? `${pad(due.getHours())}:${pad(due.getMinutes())}` : "",
          staffName: s.checkout_staff ?? "",
          // checkout_responses is stored as "true"/"false" strings in the DB.
          equipmentStatuses: (s.checkout_responses ?? []).map((r) => String(r) === "true" ? "Present" : "Not Present"),
        },
      });
    }
    getSubmission();
  }, [id])

  if (!view) return null;

  // No onSubmit: the submission is shown read-only with a Back button.
  return <CheckoutForm form={view.form} initialValues={view.values} />
}

export default function SubmissionViewPage() {
  return (
    <Suspense>
      <SuspendedViewPage />
    </Suspense>
  )
}
