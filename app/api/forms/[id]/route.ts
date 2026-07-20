import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const form = await prisma.forms.findUnique({ where: { id: BigInt(id) } })
  if (!form) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json({ ...form, id: Number(form.id) })
}

export async function PATCH(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const body = await request.json()
  const form = await prisma.forms.update({
    where: { id: BigInt(id) },
    data: {
      title: body.title,
      category: body.category,
      description: body.description,
      equipment_labels: body.equipment_labels ?? [],
      equipment_images: body.equipment_images ?? [],
      updated_at: new Date(),
    },
  })
  return NextResponse.json({ ...form, id: Number(form.id) })
}

export async function DELETE(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  await prisma.forms.delete({ where: { id: BigInt(id) } })
  return NextResponse.json({ success: true })
}
