'use client';

import { Suspense, useEffect, useState } from 'react';
import { FormEditor } from "@/components/FormEditor";
import { useParams, useRouter } from "next/navigation";

type TForm = {
  title: string;
  category: string;
  description: string;
  equipment_labels: string[];
  equipment_images: string[];
};

function SuspendedEditPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState<TForm | null>(null);

  useEffect(() => {
    async function getFormData() {
      const res = await fetch(`/api/forms/${id}`);
      if (!res.ok) return;
      setForm(await res.json());
    }
    getFormData();
  }, [id]);

  // Render the editor only once the form has loaded, so its fields can be
  // prefilled through useState initializers.
  if (!form) return null;

  return (
    <FormEditor
      heading="Edit Form"
      initial={{
        title: form.title,
        category: form.category,
        description: form.description,
        equipment: form.equipment_labels.map((name, index) => ({
          name,
          image: form.equipment_images[index],
        })),
      }}
      onSave={async (input) => {
        const res = await fetch(`/api/forms/${id}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });
        if (!res.ok) {
          console.error("Update failed:", await res.text());
        } else {
          router.push("/admin/forms");
        }
      }}
    />
  );
}

export default function EditFormPage() {
  return (
    <Suspense>
      <SuspendedEditPage />
    </Suspense>
  );
}
