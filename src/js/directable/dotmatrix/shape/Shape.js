import ApplicationLogger from '../../../application/ApplicationLogger.js';
import DrawType from '../enum/DrawType.js';

export default class Shape {
	#SHAPE_ID;

	#positionGridsIndex = 0;
	positionGrids = [];

	#dotManager;
	#isComplete = false;

	#delay = 0;
	#drawType;

	#LOG_LEVEL = -1; // 7;

	// _________________________________________________________________________

	constructor(dotManager, delay, drawType) {
		ApplicationLogger.log('Shape', this.#LOG_LEVEL);

		// Store Delay
		this.#dotManager = dotManager;
		this.#delay = delay;
		this.#drawType = drawType;

		// Generate Unique ID
		this.#SHAPE_ID = crypto.randomUUID();
	}

	// ____________________________________________________________________ Tick

	tick() {
		// Complete ?
		if (this.#isComplete) {
			return true;
		}

		// Empty Position Grids ? (space or empty glyph)
		if (this.positionGrids.length === 0) {
			return false;
		}

		// Delay
		if (this.#delay > 0) {
			this.#delay -= 1;
			return false;
		}

		// Get Position Grid
		const POSITION_GRID = this.positionGrids[this.#positionGridsIndex];

		// Get Dot Index
		let DOT_INDEX = this.#dotManager.getDotIndexAtGrid(
			POSITION_GRID[0],
			POSITION_GRID[1],
		);

		// Fill Dot
		if (DOT_INDEX > -1) {
			if (this.#drawType === DrawType.Fill) {
				this.#dotManager.fillDot(DOT_INDEX);
			} else if (this.#drawType === DrawType.Clear) {
				this.#dotManager.clearDot(DOT_INDEX);
			}
		}

		// Increment Index
		this.#positionGridsIndex += 1;

		// Check Complete
		if (this.#positionGridsIndex >= this.positionGrids.length) {
			this.#isComplete = true;
		}

		return false;
	}

	// ____________________________________________________________________ Stop

	stop() {
		this.#isComplete = true;
	}

	// __________________________________________________________________ Access

	getShapeId() {
		ApplicationLogger.log(
			`Shape getShapeId ${this.#SHAPE_ID}`,
			this.#LOG_LEVEL,
		);

		return this.#SHAPE_ID;
	}

	getDelay() {
		return this.#delay;
	}
}
