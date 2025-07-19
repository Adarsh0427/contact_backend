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

-- create index on Contact (phoneNumber) and (email):
CREATE INDEX IF NOT EXISTS idx_contact_phone ON Contact (phoneNumber);
CREATE INDEX IF NOT EXISTS idx_contact_email ON Contact (email);

-- update timestamp triggers
CREATE OR REPLACE FUNCTION update_contact_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updatedAt = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE 'plpgsql';

CREATE TRIGGER update_contact_timestamp
BEFORE UPDATE ON Contact
FOR EACH ROW
EXECUTE FUNCTION update_contact_timestamp();