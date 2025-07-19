import { query } from "../utils/db";

/**
 * get email by ids
 * @param ids - Contact ID
 * @return Promise<string[]> Email addresses
 */
const getEmailById = async (ids: number[]) => {
    const sql = `
        SELECT DISTINCT email FROM contact
        WHERE (id = ANY($1)) OR (linkedId = ANY($1)) AND deletedAt IS NULL
    `;
    const result = await query(sql, [ids]);
    return result.rows;
};

/**
 * get all ids by primary id
 * @param {Number[]} ids - Primary Contact ID
 * @return Promise<number[]> Contact IDs
 */
const getAllIdsByPrimaryId = async (ids: number[]) => {
    const sql = `
        SELECT id FROM contact
        WHERE (id = ANY($1)) OR (linkedId = ANY($1)) AND deletedAt IS NULL
    `;
    const result = await query(sql, [ids]);
    return result.rows.map(row => Number(row.id));
};

/**
 * get phone number by ids
 * @param ids - Contact ID
 * @return Promise<string[]> Phone numbers
 */
const getPhoneNumberById = async (ids: number[]) => {
    const sql = `
        SELECT DISTINCT phoneNumber FROM contact
        WHERE (id = ANY($1)) OR (linkedId = ANY($1)) AND deletedAt IS NULL
    `;
    const result = await query(sql, [ids]);
    return result.rows;
};

/**
 * Find a contact by details by email and phone number
 * @param {Object}  - Contact details (email and phone number)
 * @returns {Promise<Object>} unique linked contacts Id (oldest first)
 */
export const findLinkedContacts = async (email?: string, phoneNumber?: string) => {
    const sql = `
        SELECT DISTINCT
            CASE 
                WHEN linkPrecedence = 'primary' THEN id 
                WHEN linkPrecedence = 'secondary' THEN linkedId 
            END AS id,
            createdAt
        FROM contact
        WHERE (email = $1 OR phoneNumber = $2) AND deletedAt IS NULL
        ORDER BY createdAt ASC
    `;
    const result = await query(sql, [email, phoneNumber]);
    return result.rows.map(row => Number(row.id));
};

/**
 * Add a new contact to the database
 * @param {Object} contact - Contact details
 * @returns {Promise<Object>} Newly created contact details
 */
export const addContact = async (contact: { email: string; phoneNumber: string }) => {
    const sql = `
        INSERT INTO contact (email, phoneNumber, linkPrecedence, linkedId, deletedAt)
        VALUES ($1, $2, 'primary', NULL, NULL)
        RETURNING *
    `;
    const result = await query(sql, [contact.email, contact.phoneNumber]);
    return result.rows[0];
};

/**
 * Get contact details by ID and set the link precedence to 'primary'
 * @param {number[]} ids - Contact ID
 * @returns {Promise<Object>} Contact details
 */
export const getContactDetails = async (ids: number[]) => {
    const emails = await getEmailById(ids);
    const phoneNumbers = await getPhoneNumberById(ids);
    const allIds = await getAllIdsByPrimaryId(ids);
    const result = {
        emails: emails.length > 0 ? emails.map(row => row.email) : [],
        phoneNumbers: phoneNumbers.length > 0 ? phoneNumbers.map(row => row.phonenumber) : [],
        allIds: allIds.length > 0 ? allIds : []
    };
    return result;
};

/** 
 * Update the link precedence of a contact
 * @param id - Primary ID
 * @param precedence - Array of contact IDs to update
 * @returns {Promise<void>}
 */
export const updateLinkPrecedence = async (id: number, precedence: number[]) => {
    const sql = `
        UPDATE contact
        SET linkPrecedence = 'secondary', linkedId = $1, updatedAt = CURRENT_TIMESTAMP
        WHERE ((id = ANY($2)) OR (linkedId = ANY($2))) AND (id != $1) AND deletedAt IS NULL
    `;
    await query(sql, [id, precedence]);
};