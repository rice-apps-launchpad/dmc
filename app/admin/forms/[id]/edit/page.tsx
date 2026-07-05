'use client';

import { Suspense, useEffect, useState } from 'react';
import { FormEditor } from "@/components/FormEditor";
import { getForm, updateForm } from '@/lib/actions/forms';
import { useParams, useRouter } from "next/navigation";

function SuspendedEditPage() {
  const { id } = useParams<{ id: string }>();
  const numericId = Number(id);
  const router = useRouter();

  const [form, setForm] = useState<Awaited<ReturnType<typeof getForm>>>(null);

  useEffect(() => {
    async function getFormData() {
      setForm(await getForm(numericId));
    }
    getFormData();
  }, [numericId]);

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
          key: form.equipment_images[index],
        })),
      }}
      onSave={async (input) => {
        try {
          await updateForm(numericId, input);
          router.push("/admin/forms");
        } catch (error) {
          console.error("Update failed:", error instanceof Error ? error.message : error);
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
