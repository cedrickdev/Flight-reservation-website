/** Validates customer documents before any bytes are persisted to storage. */
export const REQUEST_DOCUMENT_TYPES = new Set(["application/pdf", "image/jpeg", "image/png"]);
export const MAX_REQUEST_DOCUMENT_BYTES = 5 * 1024 * 1024;
export const MAX_REQUEST_DOCUMENTS = 3;

export type IncomingRequestDocument = {
  name: string;
  mimeType: string;
  sizeBytes: number;
  dataBase64: string;
};

export function sanitizeDocumentName(name: string) {
  const normalized = name.normalize("NFKD").replace(/[^a-zA-Z0-9._-]/g, "-");
  return normalized.replace(/-+/g, "-").replace(/^-|-$/g, "").slice(0, 180) || "document";
}

export function decodeAndValidateDocument(document: IncomingRequestDocument) {
  if (!REQUEST_DOCUMENT_TYPES.has(document.mimeType)) {
    throw new Error("Unsupported document format");
  }
  if (!Number.isInteger(document.sizeBytes) || document.sizeBytes <= 0 || document.sizeBytes > MAX_REQUEST_DOCUMENT_BYTES) {
    throw new Error("Document size is invalid");
  }
  if (!/^[A-Za-z0-9+/=]+$/.test(document.dataBase64)) {
    throw new Error("Document encoding is invalid");
  }

  const bytes = Buffer.from(document.dataBase64, "base64");
  if (bytes.byteLength !== document.sizeBytes || bytes.byteLength > MAX_REQUEST_DOCUMENT_BYTES) {
    throw new Error("Document bytes do not match declared size");
  }
  return { bytes, safeName: sanitizeDocumentName(document.name) };
}
