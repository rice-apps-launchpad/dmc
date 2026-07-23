import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import { join } from 'path'

// Next.js snapshots the /public directory listing when the server starts, so
// files uploaded to public/uploads while the server is running 404 until the
// next restart. Route new uploads through here instead: it reads the file
// from disk on every request, so it always sees what's actually on disk.

const CONTENT_TYPES: Record<string, string> = {
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  webp: 'image/webp',
  svg: 'image/svg+xml',
}

export async function GET(_req: Request, { params }: { params: Promise<{ filename: string }> }) {
  const { filename } = await params
  if (filename.includes('/') || filename.includes('..')) {
    return NextResponse.json({ error: 'Invalid filename' }, { status: 400 })
  }

  try {
    const data = await readFile(join(process.cwd(), 'public', 'uploads', filename))
    const ext = filename.split('.').pop()?.toLowerCase() ?? ''
    return new NextResponse(new Uint8Array(data), {
      headers: { 'Content-Type': CONTENT_TYPES[ext] ?? 'application/octet-stream' },
    })
  } catch {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
