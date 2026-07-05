"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import type { Submission } from "@prisma/client";
import type { TSubmission } from "@/app/admin/submissions/page";

/**
 * Converts a Prisma row into the shape the admin pages have always used
 * (snake_case fields, ISO date strings, numeric id), so the page code is
 * unchanged from the original Supabase version.
 */
function toTSubmission(s: Submission): TSubmission {
  return {
    id: Number(s.id),
    created_at: s.createdAt.toISOString(),
    updated_at: s.updatedAt?.toISOString() ?? "",
    netid: s.netid ?? "",
    title: s.title ?? "",
    category: s.category ?? "",
    description: s.description ?? "",
    equipment_images: s.equipmentImages,
    equipment_labels: s.equipmentLabels,
    checkout_responses: s.checkoutResponses,
    due_date: s.dueDate?.toISOString() ?? "",
    due_time: s.dueTime?.toISOString() ?? "",
    checkout_staff: s.checkoutStaff ?? "",
    checkin_responses: s.checkinResponses,
    checkin_staff: s.checkinStaff ?? "",
    parts_working: s.partsWorking ?? false,
    checkin_description: s.checkinDescription ?? "",
    status: s.status,
  };
}

export async function getSubmissions(): Promise<TSubmission[]> {
  const submissions = await prisma.submission.findMany({ orderBy: { id: "asc" } });
  return submissions.map(toTSubmission);
}

export async function getSubmission(id: number): Promise<TSubmission | null> {
  const submission = await prisma.submission.findUnique({ where: { id } });
  return submission ? toTSubmission(submission) : null;
}

export type CheckoutInput = {
  netid: string;
  /** YYYY-MM-DD, as produced by <input type="date">. */
  dueDate: string;
  /** HH:MM, as produced by <input type="time">. */
  dueTime: string;
  checkoutStaff: string;
  checkoutResponses: boolean[];
  title: string;
  category: string;
  description: string;
  equipmentLabels: string[];
  equipmentImages: string[];
};

export async function createSubmission(input: CheckoutInput): Promise<number> {
  const submission = await prisma.submission.create({
    data: {
      netid: input.netid,
      dueDate: new Date(input.dueDate),
      // due_time is a timetz column; anchor the wall-clock time to UTC so it
      // round-trips deterministically regardless of server timezone.
      dueTime: new Date(`1970-01-01T${input.dueTime}:00Z`),
      checkoutStaff: input.checkoutStaff,
      checkoutResponses: input.checkoutResponses,
      title: input.title,
      category: input.category,
      description: input.description,
      equipmentLabels: input.equipmentLabels,
      equipmentImages: input.equipmentImages,
      status: "Checked Out",
    },
  });
  revalidatePath("/admin/submissions");
  return Number(submission.id);
}

export type CheckInInput = {
  checkinResponses: boolean[];
  checkinStaff: string;
  checkinDescription: string;
  partsWorking: boolean;
};

export async function checkInSubmission(id: number, input: CheckInInput): Promise<void> {
  await prisma.submission.update({
    where: { id },
    data: {
      checkinResponses: input.checkinResponses,
      checkinStaff: input.checkinStaff,
      checkinDescription: input.checkinDescription,
      partsWorking: input.partsWorking,
      status: "Checked In",
    },
  });
  revalidatePath("/admin/submissions");
}
