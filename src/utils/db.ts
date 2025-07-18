const { Pool } = require("pg");
const logger = require("./logger");

let pool : any = null;

/**
 * Initialize database connection pool
 * @returns {Pool} PostgreSQL connection pool
 */
const initializePool = () => {
	if (!pool) {
		pool = new Pool({
			host: process.env.DB_HOST,
			port: Number(process.env.DB_PORT),
			database: process.env.DB_NAME,
			user: process.env.DB_USER,
			password: process.env.DB_PASSWORD,
		});

		pool.on("error", (err : Error) => {
			logger.critical("Unexpected error on idle client", err);
		});
	}
	return pool;
};

/**
 * Connect to the database and test connection
 */
const connectDB = async () => {
	try {
		const dbPool = initializePool();
		const client = await dbPool.connect();
		logger.verbose("Connected to PostgreSQL database");
		client.release();
	} catch (error) {
		logger.critical("Failed to connect to database:", error);
		throw error;
	}
};

/**
 * Execute a database query
 * @param {string} text - SQL query string
 * @param {Array} params - Query parameters
 * @returns {Promise<Object>} Query result
 */
const query = async (text : string, params : any[] = []) => {
	const dbPool = initializePool();
	const start = Date.now();

	try {
		const result = await dbPool.query(text, params);
		const duration = Date.now() - start;
		logger.verbose("Executed query", {
			text,
			duration,
			rows: result.rowCount,
		});
		return result;
	} catch (error) {
		logger.critical("Database query error:", error);
		throw error;
	}
};

/**
 * Get a database client for transactions
 * @returns {Promise<Object>} Database client
 */
const getClient = async () => {
	const dbPool = initializePool();
	return await dbPool.connect();
};

module.exports = {
	connectDB,
	query,
	getClient,
};
