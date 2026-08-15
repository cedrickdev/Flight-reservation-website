import { describe, expect, it } from "vitest";

describe("SMTP configuration", () => {
  it("authenticates against the configured SMTP endpoint without sending mail", async () => {
    const host = process.env.SMTP_HOST;
    const port = Number(process.env.SMTP_PORT || 587);
    const user = process.env.SMTP_USER;
    const password = process.env.SMTP_PASSWORD;
    const from = process.env.SMTP_FROM;
    const recipient = process.env.CONTACT_EMAIL;

    expect(host).toBeTruthy();
    expect(port).toBeGreaterThan(0);
    expect(user).toBeTruthy();
    expect(password).toBeTruthy();
    expect(from).toBeTruthy();
    expect(recipient).toBe("contact@trustelitetravels.com");

    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure: port === 465,
      auth: { user, pass: password },
      requireTLS: port !== 465,
      connectionTimeout: 8_000,
      greetingTimeout: 8_000,
      socketTimeout: 8_000,
    });

    await expect(transporter.verify()).resolves.toBe(true);
    transporter.close();
  }, 20_000);
});
