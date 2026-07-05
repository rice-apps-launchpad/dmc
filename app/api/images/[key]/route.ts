import { getImageStorage } from "@/lib/storage";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ key: string }> }
) {
  const { key } = await params;
  const image = await getImageStorage().download(key);

  if (!image) {
    return new Response("Image not found", { status: 404 });
  }

  return new Response(image.data, {
    headers: {
      "Content-Type": image.contentType,
      // Keys are random per upload and never rewritten, so long-lived caching is safe.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}
