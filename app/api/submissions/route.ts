import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

function serialize(s: Record<string, unknown>) {
  return {
    ...s,
    id: Number(s.id),
    due_time: s.due_time instanceof Date ? s.due_time.toISOString() : s.due_time,
    due_date: s.due_date instanceof Date ? (s.due_date as Date).toISOString().split('T')[0] : s.due_date,
  }
}

export async function GET() {
  const submissions = await prisma.submissions.findMany({
    orderBy: { created_at: 'desc' },
  })
  return NextResponse.json(submissions.map(s => serialize(s as unknown as Record<string, unknown>)))
}

// Bulk delete: removes every submission created on or before `before`
// (a "YYYY-MM-DD" date). Skips still-checked-out submissions unless
// `includeCheckedOut` is set. Admin-only (enforced in proxy.ts).
export async function DELETE(request: Request) {
  const body = await request.json().catch(() => null)
  const before = body?.before
  if (typeof before !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(before)) {
    return NextResponse.json({ error: 'Expected "before" as YYYY-MM-DD' }, { status: 400 })
  }

  if (Number.isNaN(new Date(`${before}T00:00:00`).getTime())) {
    return NextResponse.json({ error: 'Invalid date' }, { status: 400 })
  }

  // "On or before" the calendar date = strictly before the next midnight in
  // the library's timezone. AT TIME ZONE pins the day boundary to Chicago
  // wall-clock time no matter what timezone the server or DB session uses.
  // The comparison happens entirely in SQL because the Prisma pg driver
  // adapter serializes JS Date params as naive UTC strings, which Postgres
  // reads in the session timezone — shifting a Date cutoff by the UTC offset.
  const count = body?.includeCheckedOut
    ? await prisma.$executeRaw`DELETE FROM submissions WHERE created_at < ((${before}::date + 1)::timestamp AT TIME ZONE 'America/Chicago')`
    : await prisma.$executeRaw`DELETE FROM submissions WHERE created_at < ((${before}::date + 1)::timestamp AT TIME ZONE 'America/Chicago') AND status = 'Checked In'`
  return NextResponse.json({ count })
}

export async function POST(request: Request) {
  const body = await request.json()
  const submission = await prisma.submissions.create({
    data: {
      netid: body.netid,
      name: body.name,
      title: body.title,
      category: body.category,
      description: body.description,
      equipment_images: body.equipment_images ?? [],
      equipment_labels: body.equipment_labels ?? [],
      checkout_responses: (body.checkout_responses ?? []).map(String),
      due_date: body.due_date ? new Date(body.due_date) : null,
      due_time: body.due_time ? new Date(`1970-01-01T${body.due_time}`) : null,
      checkout_staff: body.checkout_staff,
      status: body.status ?? 'Checked Out',
    },
  })
  return NextResponse.json(serialize(submission as unknown as Record<string, unknown>), { status: 201 })
}
