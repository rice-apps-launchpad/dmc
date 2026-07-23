'use client';

import { FormEditor } from "@/components/FormEditor";
import { useRouter } from "next/navigation";

export default function Page() {
  const router = useRouter();

  return (
    <FormEditor
      heading="New Form"
      onSave={async (input) => {
        const res = await fetch('/api/forms', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(input),
        });

        if (!res.ok) {
          console.error("Insert failed:", await res.text());
        } else {
          router.push("/admin/forms");
        }
      }}
    />
  );
}
