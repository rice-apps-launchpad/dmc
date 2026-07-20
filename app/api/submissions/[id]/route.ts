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

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const submission = await prisma.submissions.findUnique({ where: { id: BigInt(id) } })
  if (!submission) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(serialize(submission as unknown as Record<string, unknown>))
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()

  const data: Record<string, unknown> = {}
  if (body.checkin_responses !== undefined) data.checkin_responses = body.checkin_responses.map(String)
  if (body.checkin_staff !== undefined) data.checkin_staff = body.checkin_staff
  if (body.checkin_description !== undefined) data.checkin_description = body.checkin_description
  if (body.parts_working !== undefined) data.parts_working = body.parts_working
  if (body.status !== undefined) data.status = body.status

  const submission = await prisma.submissions.update({
    where: { id: BigInt(id) },
    data,
  })
  return NextResponse.json(serialize(submission as unknown as Record<string, unknown>))
}
