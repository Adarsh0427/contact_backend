CREATE TABLE IF NOT EXISTS Contact (
    id SERIAL PRIMARY KEY,
    phoneNumber VARCHAR(255),
    email VARCHAR(255),
    linkedId INT,
    linkPrecedence VARCHAR(10) CHECK (linkPrecedence IN ('primary', 'secondary')),
    createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    deletedAt TIMESTAMP NULL,
    FOREIGN KEY (linkedId) REFERENCES Contact(id),
    UNIQUE (phoneNumber, email)
);

-- update timestamp triggers
CREATE OR REPLACE FUNCTION update_contact_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_contact_timestamp ON Contact;
CREATE TRIGGER update_contact_timestamp
BEFORE UPDATE ON Contact
FOR EACH ROW
EXECUTE FUNCTION update_contact_timestamp();

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_contact_not_deleted ON Contact(deletedAt) WHERE deletedAt IS NULL;
CREATE INDEX IF NOT EXISTS idx_contact_email ON Contact(email);
CREATE INDEX IF NOT EXISTS idx_contact_phoneNumber ON Contact(phoneNumber);
