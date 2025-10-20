import ApplicationLogger from '../../../application/ApplicationLogger.js';
import RenderSurface from '../../../render/RenderSurface.js';
import GridData from '../../../grid/GridData.js';

// Texture Data
const GRID_WIDTH = GridData.getGridCellWidthPx();
const GRID_HEIGHT = GridData.getGridCellHeightPx();
const PIXEL_COUNT = GRID_WIDTH * GRID_HEIGHT;

// Filled
const FILLED_DATA = new Uint8Array(PIXEL_COUNT * 4);

for (let i = 0; i < PIXEL_COUNT; i++) {
	FILLED_DATA[i * 4 + 0] = 255; // R
	FILLED_DATA[i * 4 + 1] = 255; // G
	FILLED_DATA[i * 4 + 2] = 255; // B
	FILLED_DATA[i * 4 + 3] = 255; // A
}

// Cleared
const CLEARED_DATA = new Uint8Array(PIXEL_COUNT * 4); // Initializes to all 0s

// _____________________________________________________________________________

export default class Dot {
	#positionPixelsX = 0;
	#positionPixelsY = 0;

	#isFilled = false;

	#LOG_LEVEL = -1; // 6;

	// _________________________________________________________________________

	constructor(positionPixelsX, positionPixelsY) {
		// ApplicationLogger.log(`Dot ${dotIndex}`, this.#LOG_LEVEL);

		// Store
		this.#positionPixelsX = positionPixelsX;
		this.#positionPixelsY = positionPixelsY;
	}

	// ____________________________________________________________________ Fill

	fill() {
		ApplicationLogger.log(
			`Dot fill at ${this.#positionPixelsX} ${this.#positionPixelsY}`,
			this.#LOG_LEVEL,
		);

		// If already filled, nothing to do
		if (this.#isFilled === true) {
			return;
		}

		// Set the data to the texture at the dot's position
		RenderSurface.setTextureData(
			this.#positionPixelsX,
			this.#positionPixelsY,
			GRID_WIDTH,
			GRID_HEIGHT,
			FILLED_DATA,
		);

		// Filled
		this.#isFilled = true;
	}

	// ___________________________________________________________________ Clear

	clear() {
		ApplicationLogger.log(
			`Dot clear at ${this.#positionPixelsX} ${this.#positionPixelsY}`,
			this.#LOG_LEVEL,
		);

		// If not filled, nothing to clear
		if (this.#isFilled === false) {
			return;
		}

		// Set the data to the texture at the dot's position
		RenderSurface.setTextureData(
			this.#positionPixelsX,
			this.#positionPixelsY,
			GRID_WIDTH,
			GRID_HEIGHT,
			CLEARED_DATA,
		);

		// Not Filled
		this.#isFilled = false;
	}
}
