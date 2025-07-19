import { Request, Response } from "express";
import {findLinkedContacts, addContact, getContactDetails, updateLinkPrecedence } from "../models/identify";
import { Identity, identitySchema } from "../utils/validation";

const formatResponse = (primaryId : Number , details : {emails: string[], phoneNumbers: string[], allIds?: number[]}, existingIds? : Number[]) => {
    const secondaryIds = details.allIds?.filter(id => id !== primaryId) || [];
    return {
        contact: {
            primaryContactId: primaryId,
            emails: details.emails,
            phoneNumbers: details.phoneNumbers,
            secondaryContactIds: secondaryIds || []
        }
    };
};

export const handleIdentify = async (req: Request, res: Response) => {
    console.log("received request to identify contact", req.body);
    const detail = identitySchema.safeParse(req.body);
    if (!detail.success) {
        return res.status(400).json({
            error: "Invalid input",
            details: detail.error.issues.map(issue => ({
                message: issue.message,
                path: issue.path
            }))
        });
    }
    let {email , phoneNumber} = detail.data as Identity;
    if (!email && !phoneNumber) {
        return res.status(400).json({
            error: "At least one of email or phone number must be provided"
        });
    }
    email = email?.trim() || "";
    phoneNumber = phoneNumber?.trim() || "";
    try {
        const existingContactId = await findLinkedContacts(email, phoneNumber);
        if (existingContactId.length == 0) {
            // If no existing contact found, create a new one
            if (!email || !phoneNumber) {
                return res.status(400).json({
                    error: "Both email and phone number are required to create a new contact"
                });
            }
            const newContact = await addContact({ email, phoneNumber });
            return res.status(200).json(formatResponse(newContact.id, {
                emails: [newContact.email],
                phoneNumbers: [newContact.phoneNumber]
            }));
        }
        const primaryId = existingContactId[0];
        // console.log("existing contact found", existingContactId);
        const contactDetails = await getContactDetails(existingContactId);
        console.log("contact details found", contactDetails);
        
        updateLinkPrecedence(primaryId, contactDetails.allIds || []);

        const response = formatResponse(primaryId, contactDetails);
        return res.status(200).json(response);

    } catch (error) {
        return res.status(500).json({
            error: "Internal server error",
            details: error instanceof Error ? error.message : "Unknown error"
        });
    }
};