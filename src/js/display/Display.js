import ApplicationConfiguration from '../application/ApplicationConfiguration.js';
import ApplicationLogger from '../application/ApplicationLogger.js';

import GridData from '../grid/GridData.js';

export default class Display {
	static #APPLICATION_CONTAINER;
	static #DISPLAY_HOLDER;

	static #widthPx = -1;
	static #heightPx = -1;

	static #LOG_LEVEL = 2;

	// _________________________________________________________________________

	static initialise() {
		ApplicationLogger.log('Display', this.#LOG_LEVEL);

		// Store Application Container
		this.#APPLICATION_CONTAINER =
			ApplicationConfiguration.getApplicationContainer();

		// Create Display Holder
		this.#DISPLAY_HOLDER = document.createElement('div');
		this.#DISPLAY_HOLDER.classList.add('display');

		// Append
		this.#APPLICATION_CONTAINER.appendChild(this.#DISPLAY_HOLDER);

		// Set Initial
		this.tick();
	}

	// __________________________________________________________________ Resize

	static tick() {
		// Assume No Change
		let didResizeThisFrame = false;

		// Get Application Rectangle
		const APPLICATION_RECTANGLE =
			this.#APPLICATION_CONTAINER.getBoundingClientRect();

		// Get Dimensions
		const APPLICATION_WIDTH = APPLICATION_RECTANGLE.width;
		const APPLICATION_HEIGHT = APPLICATION_RECTANGLE.height;

		let width;
		let height;

		// Max Width Square
		if (APPLICATION_WIDTH > APPLICATION_HEIGHT) {
			// Square
			width = APPLICATION_HEIGHT;
			height = APPLICATION_HEIGHT;
		} else {
			// Full Width
			width = APPLICATION_WIDTH;
			height = APPLICATION_HEIGHT;
		}

		// Get Grid Cell Width
		const GRID_CELL_WIDTH_PX = GridData.getGridCellWidthPx();

		// Round Width Down to Nearest Grid Cell Width
		width = Math.floor(width / GRID_CELL_WIDTH_PX) * GRID_CELL_WIDTH_PX;

		// Int
		width = Math.floor(width);
		height = Math.floor(height);

		// Changed Width Height ?
		if (width !== this.#widthPx || height !== this.#heightPx) {
			ApplicationLogger.log(
				`Display - Resizing to ${width} ${height}`,
				this.#LOG_LEVEL,
			);

			// Store
			this.#widthPx = width;
			this.#heightPx = height;

			// Set Display Holder Size
			this.#DISPLAY_HOLDER.style.width = `${this.#widthPx}px`;
			this.#DISPLAY_HOLDER.style.height = `${this.#heightPx}px`;

			// Resized This Frame
			didResizeThisFrame = true;
		}

		return didResizeThisFrame;
	}

	// __________________________________________________________________ Access

	static getWidthPx() {
		return this.#widthPx;
	}

	static getHeightPx() {
		return this.#heightPx;
	}

	static getDisplayHolder() {
		return this.#DISPLAY_HOLDER;
	}
}
