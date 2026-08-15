import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { createTravelRequest } from "./db";
import { decodeAndValidateDocument, MAX_REQUEST_DOCUMENTS } from "./requestStorage";
import { storagePut } from "./storage";
import { nanoid } from "nanoid";
import { z } from "zod";
import { sendRequesterConfirmationEmail, sendTravelRequestEmail } from "./email";

const requestInput = z.object({
  service: z.string().trim().min(2).max(128),
  project: z.string().trim().min(2).max(255),
  requesterName: z.string().trim().min(2).max(160),
  phone: z.string().trim().min(6).max(48),
  email: z.string().trim().email().max(320),
  details: z.string().trim().max(5000).optional(),
  attachments: z.array(z.object({
    name: z.string().trim().min(1).max(255),
    mimeType: z.string().trim().min(1).max(160),
    sizeBytes: z.number().int().positive(),
    dataBase64: z.string().min(4),
  })).max(MAX_REQUEST_DOCUMENTS),
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),
  requests: router({
    create: publicProcedure.input(requestInput).mutation(async ({ input }) => {
      const requestCode = `TET-${nanoid(8).toUpperCase()}`;
      const attachments = await Promise.all(input.attachments.map(async document => {
        const { bytes, safeName } = decodeAndValidateDocument(document);
        const stored = await storagePut(`travel-requests/${requestCode}/${safeName}`, bytes, document.mimeType);
        return {
          storageKey: stored.key,
          storageUrl: stored.url,
          originalName: document.name,
          mimeType: document.mimeType,
          sizeBytes: document.sizeBytes,
        };
      }));

      const savedRequest = await createTravelRequest({
        requestCode,
        service: input.service,
        project: input.project,
        requesterName: input.requesterName,
        phone: input.phone,
        email: input.email,
        details: input.details,
        attachments,
      });

      try {
        await sendTravelRequestEmail({
          requestCode,
          service: input.service,
          project: input.project,
          requesterName: input.requesterName,
          phone: input.phone,
          email: input.email,
          details: input.details,
          attachments,
        });
      } catch (error) {
        console.error("[Email] Could not deliver travel request notification", error);
      }

      try {
        await sendRequesterConfirmationEmail({
          requesterName: input.requesterName,
          email: input.email,
          service: input.service,
        });
      } catch (error) {
        console.error("[Email] Could not deliver requester confirmation", error);
      }

      return savedRequest;
    }),
  }),
});

export type AppRouter = typeof appRouter;
