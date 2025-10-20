import ApplicationLogger from '../../../application/ApplicationLogger.js';
import InteractiveSurface from '../../../interactive/InteractiveSurface.js';

import ComponentRectangle from '../component/primative/ComponentRectangle.js';

import FillType from '../enum/FillType.js';
import FillStrategyType from '../enum/FillStrategyType.js';
import DrawType from '../enum/DrawType.js';

export default class DotMatrixView {
	SHAPE_MANAGER;
	COMPONENT_MANAGER;

	INTERACTIVE_GRID_XS = [];
	INTERACTIVE_GRID_YS = [];
	INTERACTIVE_GLYPH_WIDTHS = [];
	INTERACTIVE_BLOCK_IDS = [];

	#VIEW_ID;

	isActive = false;

	#LOG_LEVEL = -1; // 4;

	// _________________________________________________________________________

	constructor(shapeManager, componentManager, viewId) {
		ApplicationLogger.log(`View '${viewId}'`, this.#LOG_LEVEL);

		// Store
		this.SHAPE_MANAGER = shapeManager;
		this.COMPONENT_MANAGER = componentManager;
		this.#VIEW_ID = viewId;
	}

	// ___________________________________________________________________ Start

	start(delayFrames = 0) {
		ApplicationLogger.log(
			`View '${this.#VIEW_ID}' start delay ${delayFrames}`,
			this.#LOG_LEVEL,
		);

		// Reset Interactive Blocks
		this.INTERACTIVE_GRID_XS = [];
		this.INTERACTIVE_GRID_YS = [];
		this.INTERACTIVE_GLYPH_WIDTHS = [];
		this.INTERACTIVE_BLOCK_IDS = [];

		// Active
		this.isActive = true;
	}

	// ____________________________________________________________________ Stop

	stop(delayFrames = 0) {
		ApplicationLogger.log(
			`View '${this.#VIEW_ID}' stop delay ${delayFrames}`,
			this.#LOG_LEVEL,
		);

		// Clear Interactive Blocks
		this.#clearInteractiveBlocks();

		// Inactive
		this.isActive = false;
	}

	// ____________________________________________________________________ Draw

	draw(delayFrames = 0, drawType = DrawType.Fill) {
		ApplicationLogger.log(
			`View '${this.#VIEW_ID}' draw delay ${delayFrames} drawType ${drawType}`,
			this.#LOG_LEVEL,
		);
	}

	onDrawComplete() {
		ApplicationLogger.log(
			`View '${this.#VIEW_ID}' onDrawComplete`,
			this.#LOG_LEVEL,
		);
	}

	// ____________________________________________________________________ Tick

	tick() {} // Stub

	// ___________________________________________________________________ Reset

	#clearInteractiveBlocks() {
		ApplicationLogger.log(
			`View '${this.#VIEW_ID}' clearInteractiveBlocks`,
			this.#LOG_LEVEL,
		);

		// Destroy Interactive Blocks
		for (let i = 0; i < this.INTERACTIVE_BLOCK_IDS.length; i += 1) {
			ApplicationLogger.log(
				` - Removing Block ${this.INTERACTIVE_BLOCK_IDS[i]}`,
				this.#LOG_LEVEL,
			);

			InteractiveSurface.removeBlock(this.INTERACTIVE_BLOCK_IDS[i]);
		}

		// Reset Interactive Block Ids
		this.INTERACTIVE_BLOCK_IDS = [];
	}

	// ______________________________________________________________ Rectangles

	addRectanglesBlock(
		shapeManager,
		componentManager,
		gridX,
		gridY,
		gridWidth,
		gridHeight,
		delayFrames,
		fillType = FillType.PassThrough,
		fillStrategyType = FillStrategyType.PassThrough,
		drawType = DrawType.Fill,
	) {
		const BLOCK_WIDTH = 3;

		// Create Component Rectangles
		let i = 0;

		for (let w = 0; w < gridWidth; w += BLOCK_WIDTH) {
			// Calculate Width to ensure it doesn't exceed gridWidth
			const actualWidth = Math.min(BLOCK_WIDTH, gridWidth - w);

			// Skip if width is 0 or negative
			if (actualWidth <= 0) break;

			// Create Component Rectangle
			const COMPONENT_RECTANGLE = new ComponentRectangle(
				shapeManager,
				gridX + w,
				gridY,
				actualWidth,
				gridHeight,
				delayFrames + i,
				fillType,
				fillStrategyType,
				drawType,
			);

			componentManager.addComponent(COMPONENT_RECTANGLE);

			// Increment
			i++;
		}
	}

	// __________________________________________________________________ Access

	getViewId() {
		return this.#VIEW_ID;
	}
}
