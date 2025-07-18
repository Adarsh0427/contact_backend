/**
 * Logging utility with different verbosity levels
 */

const LOG_LEVELS = {
	VERBOSE: "verbose",
	CRITICAL: "critical",
	ERROR: "error",
};

const currentLogLevel = process.env.LOG_LEVEL || LOG_LEVELS.VERBOSE;

/**
 * Log verbose messages (debug, info, etc.)
 * @param {...any} args - Arguments to log
 */
const verbose = (...args: any[]) => {
	if (currentLogLevel === LOG_LEVELS.VERBOSE) {
		console.log("[VERBOSE]", new Date().toISOString(), ...args);
	}
};

/**
 * Log critical messages (errors, warnings, etc.)
 * @param {...any} args - Arguments to log
 */
const error = (...args: any[]) => {
	if (currentLogLevel === LOG_LEVELS.ERROR) {
		console.error("[ERROR]", new Date().toISOString(), ...args);
	}
};

const critical = (...args: any[]) => {
	console.error("[CRITICAL]", new Date().toISOString(), ...args);
};

module.exports = {
	verbose,
	critical,
	error,
	LOG_LEVELS,
};
