import { LocalImageStorage } from "./local";

/** A stored image's binary contents plus the content type to serve it with. */
export type StoredImage = {
  // ArrayBuffer-backed (not ArrayBufferLike) so it can be used as a Response body.
  data: Uint8Array<ArrayBuffer>;
  contentType: string;
};

export type UploadInput = {
  data: Uint8Array;
  /** MIME type reported by the uploader, e.g. "image/png". */
  contentType?: string;
  /** Original filename, used as a fallback for choosing a file extension. */
  filename?: string;
};

/**
 * Server-side storage interface for equipment images.
 *
 * Application code should depend on this interface (via getImageStorage())
 * rather than on a concrete backend, so the underlying storage can be swapped
 * (local filesystem now, private production servers later) without touching
 * call sites. Keys returned by upload() are opaque strings and are what gets
 * persisted in the database (Form.equipmentImages / Submission.equipmentImages).
 */
export interface ImageStorage {
  /** Store an image and return the key to persist in the database. */
  upload(input: UploadInput): Promise<string>;
  /** Fetch a stored image, or null if the key doesn't exist. */
  download(key: string): Promise<StoredImage | null>;
  /** Remove a stored image. Resolves without error if the key doesn't exist. */
  delete(key: string): Promise<void>;
}

let storage: ImageStorage | null = null;

/**
 * Returns the process-wide ImageStorage instance. This is the single place to
 * swap in the production backend (e.g. branch on an env var or replace the
 * constructor) — everything else depends only on the ImageStorage interface.
 */
export function getImageStorage(): ImageStorage {
  if (!storage) {
    storage = new LocalImageStorage(process.env.IMAGE_STORAGE_DIR ?? "dmc_images");
  }
  return storage;
}
