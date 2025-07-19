// create setup-database.ts to initialize the database from neon db string
import * as fs from 'fs';
import * as path from 'path';
import { Pool } from "pg";

const initializePool = () => {

    const pool = new Pool({
        connectionString: process.env.DATABASE_URL,
    });

    pool.on("error", (err : Error) => {
        console.error("Unexpected error on idle client", err);
    });
    
    return pool;
};

const setupDatabase = async () => {
    const pool = initializePool();
    const client = await pool.connect();
    
    try {
        // Read the schema SQL file
        const schemaPath = path.join(__dirname, '../schema/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('Executing database schema...');
        // Execute the SQL commands
        await client.query(schemaSql);
        console.log('Database schema setup completed successfully.');
    } catch (error) {
        console.error('Error setting up database schema:', error);
        throw error;
    } finally {
        // Release the client back to the pool
        client.release();
        // Close the pool connection
        await pool.end();
    }
        
};

setupDatabase();
