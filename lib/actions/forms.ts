"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";

export type NewFormInput = {
  title: string;
  category: string;
  description: string;
  equipmentLabels: string[];
  /** Storage keys returned by the image upload API (see lib/storage/client.ts). */
  equipmentImages: string[];
};

export async function createForm(input: NewFormInput): Promise<number> {
  const form = await prisma.form.create({ data: input });
  revalidatePath("/admin/forms");
  revalidatePath("/kiosk");
  return Number(form.id);
}

export async function updateForm(id: number, input: NewFormInput): Promise<void> {
  await prisma.form.update({ where: { id }, data: input });
  revalidatePath("/admin/forms");
  revalidatePath("/kiosk");
}

export async function getForms(): Promise<{ id: number; category: string; title: string; description: string }[]> {
  const forms = await prisma.form.findMany({
    select: { id: true, category: true, title: true, description: true },
    orderBy: { id: "asc" },
  });
  return forms.map((form) => ({ ...form, id: Number(form.id) }));
}

/**
 * Returns a form in the snake_case shape the kiosk page has always used,
 * or null if it doesn't exist.
 */
export async function getForm(id: number) {
  const form = await prisma.form.findUnique({ where: { id } });
  if (!form) return null;
  return {
    id: Number(form.id),
    category: form.category,
    title: form.title,
    description: form.description,
    equipment_labels: form.equipmentLabels,
    equipment_images: form.equipmentImages,
  };
}
