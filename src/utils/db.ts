import { Pool } from "pg";

/**
 * Initialize database connection pool for neon PostgreSQL
 * @returns {Pool} PostgreSQL connection pool
 */
const initializePool = () => {

	const pool = new Pool({
		connectionString: process.env.DATABASE_URL,
	});

	pool.on("error", (err : Error) => {
		console.error("Unexpected error on idle client", err);
	});
	
	return pool;
};

/**
 * Connect to the database and test connection
 */
export const connectDB = async () => {
	try {
		const dbPool = initializePool();
		const client = await dbPool.connect();
		console.log("Connected to the database successfully!");
		client.release();
	} catch (error) {
		console.error("Failed to connect to database:", error);
		throw error;
	}
};

/**
 * Execute a database query
 * @param {string} text - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
export const query = async (text : string, params : any[] = []) => {
	const dbPool = initializePool();
	const start = Date.now();

	try {
		const result = await dbPool.query(text, params);
		const duration = Date.now() - start;
		console.log("Executed query", {
			text,
			duration,
			rows: result.rowCount,
		});
		return result;
	} catch (error) {
		console.error("Database query error:", error);
		throw error;
	}
};

/**
 * Get a database client for transactions
 * @returns {Promise<Object>} Database client
 */
export const getClient = async () => {
	const dbPool = initializePool();
	return await dbPool.connect();
};

