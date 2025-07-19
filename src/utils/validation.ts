import z from "zod";
/**
 * Validation utility functions
 */

export const identitySchema = z.object({
    email: z.email().nullable().optional(),
    phoneNumber: z.string().regex(/^\d+$/, "Phone number must contain only digits").nullable().optional(),
});
export type Identity = z.infer<typeof identitySchema>;

export const responseSchema = z.object({
    contact: z.object({
        primaryContactId: z.number(),
        emails: z.array(z.email()).min(1),
        phoneNumbers: z.array(z.string()).min(1),
        secondaryContactIds: z.array(z.number()).optional(),
    }),
});
export type ContactResponse = z.infer<typeof responseSchema>;
