// create setup-database.ts to initialize the database from neon db string
import * as fs from 'fs';
import * as path from 'path';
import { connectDB } from "../utils/db";


const setupDatabase = async () => {
    const pool : any = await connectDB();
    // Create tables from schema file

    try {
        // Read the schema SQL file
        const schemaPath = path.join(__dirname, '../schema/schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        
        console.log('Executing database schema...');
        // Execute the SQL commands
        await pool.query(schemaSql);
        console.log('Database schema setup completed successfully.');
    } catch (error) {
        console.error('Error setting up database schema:', error);
        throw error;
    } finally {
        // Close the pool connection
        await pool.end();
    }
		
};

setupDatabase();
