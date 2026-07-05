'use client';

import { FormEditor } from "@/components/FormEditor";
import { createForm } from '@/lib/actions/forms';
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <FormEditor
      heading="New Form"
      onSave={async (input) => {
        try {
          await createForm(input);
          router.push("/admin/forms");
        } catch (error) {
          console.error("Insert failed:", error instanceof Error ? error.message : error);
        }
      }}
    />
  );
}
