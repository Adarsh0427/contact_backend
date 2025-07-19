import { query } from "../utils/db";

/**
 * Find identity by email
 * @param {string} email - Email address to search for
 * @returns {Promise<Object>} Identity details
 */
export const findByEmail = async (email: string) => {
    const sql = `
        SELECT * FROM identities
        WHERE email = $1 AND deletedAt IS NULL
    `;
    const result = await query(sql, [email]);
    return result.rows[0];
};

/**
 * Find identity by phone number
 * @param {string} phoneNumber - Phone number to search for
 * @returns {Promise<Object>} Identity details
 */
export const findByPhone = async (phoneNumber: string) => {
    const sql = `
        SELECT * FROM identities
        WHERE phoneNumber = $1 AND deletedAt IS NULL
    `;
    const result = await query(sql, [phoneNumber]);
    return result.rows[0];
};
