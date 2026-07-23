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
