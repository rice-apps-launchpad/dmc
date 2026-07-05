/**
 * Client-side helpers for the image API. These talk to the /api/images route
 * handlers, which are the only code that touches the storage backend — so
 * client components stay unchanged when the backend is swapped.
 */

/** Upload an image and return the storage key to persist in the database. */
export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  const res = await fetch("/api/images", { method: "POST", body: formData });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Image upload failed with status ${res.status}`);
  }

  const { key } = await res.json();
  return key;
}

/** URL that serves the image stored under the given key. */
export function getImageUrl(key: string): string {
  return `/api/images/${encodeURIComponent(key)}`;
}
