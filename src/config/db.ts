import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const setupDatabase = async () => {
    const pool = new Pool({
        user: process.env.DB_USER,
        host: process.env.DB_HOST,
        database: process.env.DB_NAME,
        password: process.env.DB_PASSWORD,
        port: Number(process.env.DB_PORT),
    });

	try {
		console.log("Setting up database...");

		// Read and execute schema file
		const fs = require("fs");
		const path = require("path");

		const schemaSQL = fs.readFileSync(
			path.join(__dirname, "../src/sql/schema.sql"),
			"utf8"
		);
		await pool.query(schemaSQL);
		console.log("Database schema created successfully");

		console.log("Database setup completed successfully!");
	} catch (error) {
		console.error("Database setup failed!", error);
		process.exit(1);
	} finally {
		await pool.end();
	}
};

if (require.main === module) {
	setupDatabase();
}

module.exports = { setupDatabase };