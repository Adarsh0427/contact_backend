import { query } from "../utils/db";

// CREATE TABLE IF NOT EXISTS Contact (
//     id SERIAL PRIMARY KEY,
//     phoneNumber VARCHAR(255),
//     email VARCHAR(255),
//     linkedId INT,
//     linkPrecedence VARCHAR(10) CHECK (linkPrecedence IN ('primary', 'secondary')),
//     createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
//     deletedAt TIMESTAMP NULL,
//     FOREIGN KEY (linkedId) REFERENCES Contact(id)
// );

/**
 * Find a contact by details by email and phone number
 * @param {Object}  - Contact details (email and phone number)
 * @returns {Promise<Object>} unique linked contacts Id (oldest first)
 */
export const findLinkedContacts = async (email?: string, phoneNumber?: string) => {
    const sql = `
        SELECT DISTINCT id, createdAt FROM contact
        WHERE (email = $1 OR phoneNumber = $2) AND deletedAt IS NULL
        ORDER BY createdAt ASC
    `;
    const result = await query(sql, [email, phoneNumber]);
    return result.rows.map(row => row.id);
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