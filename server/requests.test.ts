import { beforeEach, describe, expect, it, vi } from "vitest";
import type { TrpcContext } from "./_core/context";

const mocks = vi.hoisted(() => ({
  storagePut: vi.fn(),
  createTravelRequest: vi.fn(),
  sendTravelRequestEmail: vi.fn(),
  sendRequesterConfirmationEmail: vi.fn(),
}));

vi.mock("./storage", () => ({ storagePut: mocks.storagePut }));
vi.mock("./db", () => ({ createTravelRequest: mocks.createTravelRequest }));
vi.mock("./email", () => ({ sendTravelRequestEmail: mocks.sendTravelRequestEmail, sendRequesterConfirmationEmail: mocks.sendRequesterConfirmationEmail }));

import { appRouter } from "./routers";

describe("requests.create", () => {
  beforeEach(() => {
    mocks.storagePut.mockReset();
    mocks.createTravelRequest.mockReset();
    mocks.sendTravelRequestEmail.mockReset();
    mocks.sendRequesterConfirmationEmail.mockReset();
    mocks.storagePut.mockResolvedValue({ key: "travel-requests/TET-TEST/passport_abcd.pdf", url: "/manus-storage/travel-requests/TET-TEST/passport_abcd.pdf" });
    mocks.createTravelRequest.mockResolvedValue({ requestCode: "TET-TEST" });
  });

  it("validates and stores attachment metadata with the new request", async () => {
    const caller = appRouter.createCaller({ user: null, req: {}, res: {} } as TrpcContext);
    const bytes = Buffer.from("sample passport document");

    const result = await caller.requests.create({
      service: "Assistance visa",
      project: "Préparer un voyage d’études",
      requesterName: "Amina M.",
      phone: "+237 600 00 00 00",
      email: "amina@example.com",
      details: "Document de test isolé",
      attachments: [{
        name: "passeport test.pdf",
        mimeType: "application/pdf",
        sizeBytes: bytes.byteLength,
        dataBase64: bytes.toString("base64"),
      }],
    });

    expect(result).toEqual({ requestCode: "TET-TEST" });
    expect(mocks.storagePut).toHaveBeenCalledWith(expect.stringMatching(/^travel-requests\/TET-[A-Z0-9_-]+\/passeport-test\.pdf$/), expect.any(Buffer), "application/pdf");
    expect(mocks.createTravelRequest).toHaveBeenCalledWith(expect.objectContaining({
      service: "Assistance visa",
      attachments: [expect.objectContaining({ originalName: "passeport test.pdf", mimeType: "application/pdf" })],
    }));
    expect(mocks.sendRequesterConfirmationEmail).toHaveBeenCalledWith({ requesterName: "Amina M.", email: "amina@example.com", service: "Assistance visa" });
  });
});
