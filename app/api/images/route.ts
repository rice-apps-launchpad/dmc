import { NextResponse } from "next/server";
import { getImageStorage } from "@/lib/storage";

export async function POST(request: Request) {
  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return NextResponse.json({ error: 'Expected a "file" form field' }, { status: 400 });
  }

  const key = await getImageStorage().upload({
    data: new Uint8Array(await file.arrayBuffer()),
    contentType: file.type || undefined,
    filename: file.name,
  });

  return NextResponse.json({ key });
}
