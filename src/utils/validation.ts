import z from "zod";

/**
 * Validation utility functions
 */

// identity 
// {
// 	"email"?: string,
// 	"phoneNumber"?: number (include country code)
// }
export const identitySchema = z.object({
    email: z.string().email().optional(),
    phoneNumber: z.string().regex(/^\+\d{1,3}\d{10}$/).optional(),
});
