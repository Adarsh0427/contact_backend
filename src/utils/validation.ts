import z, { ZodError } from "zod";
import { Request, Response, NextFunction, response } from "express";

/**
 * Validation utility functions
 */

export const identitySchema = z.object({
    email: z.email().optional(),
    phoneNumber: z.string().regex(/^\+\d{1,3}\d{10}$/).optional(),
});
export type Identity = z.infer<typeof identitySchema>;

export const responseSchema = z.object({
    contact: z.object({
        primaryContactId: z.number(),
        emails: z.array(z.email()).min(1),
        phoneNumbers: z.array(z.string().regex(/^\+\d{1,3}\d{10}$/)).min(1),
        secondaryContactIds: z.array(z.number()).optional(),
    }),
});
export type ContactResponse = z.infer<typeof responseSchema>;
