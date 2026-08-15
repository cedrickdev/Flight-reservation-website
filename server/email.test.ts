import { beforeEach, describe, expect, it, vi } from "vitest";

const sendMail = vi.fn().mockResolvedValue({ messageId: "test-message" });
const close = vi.fn();
vi.mock("nodemailer", () => ({
  default: { createTransport: vi.fn(() => ({ sendMail, close })) },
}));

import { sendRequesterConfirmationEmail, sendTravelRequestEmail } from "./email";

describe("sendTravelRequestEmail", () => {
  beforeEach(() => {
    sendMail.mockClear();
    close.mockClear();
    process.env.SMTP_HOST = "mail.infomaniak.com";
    process.env.SMTP_PORT = "587";
    process.env.SMTP_USER = "contact@trustelitetravels.com";
    process.env.SMTP_PASSWORD = "test-secret";
    process.env.SMTP_FROM = "contact@trustelitetravels.com";
    process.env.CONTACT_EMAIL = "contact@trustelitetravels.com";
  });

  it("sends a safe summary to the professional inbox", async () => {
    await sendTravelRequestEmail({
      requestCode: "TET-TEST123",
      service: "Assistance visa",
      project: "Voyage professionnel",
      requesterName: "Aïcha Client",
      phone: "+237 600 000 000",
      email: "client@example.com",
      details: "Besoin d'un accompagnement.",
      attachments: [{ originalName: "passport.pdf", storageKey: "travel-requests/TET-TEST123/passport.pdf", mimeType: "application/pdf", sizeBytes: 2048 }],
    });

    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({
      to: "contact@trustelitetravels.com",
      from: "contact@trustelitetravels.com",
      replyTo: "client@example.com",
      subject: expect.stringContaining("TET-TEST123"),
      text: expect.stringContaining("passport.pdf"),
    }));
    expect(close).toHaveBeenCalledOnce();
  });

  it("sends a receipt to the requester without exposing an internal reference", async () => {
    await sendRequesterConfirmationEmail({ requesterName: "Aïcha Client", email: "client@example.com", service: "Assistance visa" });

    expect(sendMail).toHaveBeenCalledWith(expect.objectContaining({
      to: "client@example.com",
      subject: expect.stringContaining("bien reçu"),
      text: expect.stringContaining("sous peu"),
    }));
    expect(sendMail.mock.calls[0]?.[0]?.text).not.toContain("TET-");
  });
});
