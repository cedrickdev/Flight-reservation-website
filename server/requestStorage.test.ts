import { describe, expect, it } from "vitest";
import { decodeAndValidateDocument, sanitizeDocumentName } from "./requestStorage";

describe("request document validation", () => {
  it("keeps a safe filename and accepts a matching PDF payload", () => {
    const source = Buffer.from("travel document");
    const result = decodeAndValidateDocument({
      name: "Mon visa 2026.pdf",
      mimeType: "application/pdf",
      sizeBytes: source.byteLength,
      dataBase64: source.toString("base64"),
    });

    expect(result.bytes.toString()).toBe("travel document");
    expect(result.safeName).toBe("Mon-visa-2026.pdf");
  });

  it("rejects disallowed formats and unsafe characters", () => {
    expect(() => decodeAndValidateDocument({ name: "script.exe", mimeType: "application/x-msdownload", sizeBytes: 3, dataBase64: "YWJj" })).toThrow("Unsupported document format");
    expect(sanitizeDocumentName("../../dossier important!!.png")).toBe("..-..-dossier-important-.png");
  });
});
