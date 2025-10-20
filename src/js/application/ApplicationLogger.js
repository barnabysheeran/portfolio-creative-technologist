export default class ApplicationLogger {
	static #isActive = true; // Default true for initial version console output

	static #colourLog = '#999';
	static #colourWarn = '#f00';
	static #colourError = '#f00';

	// _________________________________________________________________________

	static initialise(isActive) {
		this.#isActive = isActive;
	}

	// _____________________________________________________________________ Log

	static log(messageIn, logLevel = 0) {
		// Active ?
		if (this.#isActive !== true) {
			return;
		}

		// Level
		if (logLevel <= 0) {
			return;
		}

		// Message
		let message = messageIn;

		for (let i = 1; i < logLevel; i += 1) {
			message = `  ${message}`;
		}

		// Log
		console.log(`%c${message}`, `color: ${this.#colourLog}`);
	}

	// ____________________________________________________________________ Warn

	static warn(messageIn, logLevel = 0) {
		// Active ?
		if (this.#isActive !== true) {
			return;
		}

		// Level
		if (logLevel <= 0) {
			return;
		}

		// Message
		let message = messageIn;

		for (let i = 1; i < logLevel; i += 1) {
			message = `  ${message}`;
		}

		// Log
		console.log(`%c${message}`, `color: ${this.#colourWarn}`);
	}

	// ___________________________________________________________________ Error

	static error(messageIn, logLevel = 0) {
		// Active ?
		if (this.#isActive !== true) {
			return;
		}

		// Level
		if (logLevel <= 0) {
			return;
		}

		// Message
		let message = messageIn;

		for (let i = 1; i < logLevel; i += 1) {
			message = `  ${message}`;
		}

		// Log
		console.error(`%c${message}`, `color: ${this.#colourError}`);
	}
}
