import { NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  const forms = await prisma.forms.findMany({
    orderBy: { created_at: 'desc' },
  })
  return NextResponse.json(forms.map(f => ({ ...f, id: Number(f.id) })))
}

export async function POST(request: Request) {
  const body = await request.json()
  const form = await prisma.forms.create({
    data: {
      title: body.title,
      category: body.category,
      description: body.description,
      equipment_labels: body.equipment_labels ?? [],
      equipment_images: body.equipment_images ?? [],
    },
  })
  return NextResponse.json({ ...form, id: Number(form.id) }, { status: 201 })
}
