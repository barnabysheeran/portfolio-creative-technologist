import ApplicationLogger from '../../../../application/ApplicationLogger.js';

import Component from '../Component.js';

import DirectableDotMatrixConstants from '../../DirectableDotMatrixConstants.js';

export default class ComponentGlyphBox extends Component {
	// Unique Parameters
	TEXT;
	GRID_WIDTH;
	GRID_HEIGHT;

	#LOG_LEVEL = 3;

	// _________________________________________________________________________

	constructor(
		shapeManager,
		text,
		gridX,
		gridY,
		gridWidth,
		gridHeight,
		delay,
		delayGlyph,
		fillType,
		fillStrategyType,
		drawType,
	) {
		super(
			shapeManager,
			gridX,
			gridY,
			delay,
			delayGlyph,
			fillType,
			fillStrategyType,
			drawType,
		);

		// Store Unique Parameters
		this.TEXT = text;
		this.GRID_WIDTH = gridWidth;
		this.GRID_HEIGHT = gridHeight;

		// Create Shape
		this.#createShape();
	}

	// ____________________________________________________________ Create Shape

	#createShape() {
		// Get Constants
		const GLYPH_SPACING_X = DirectableDotMatrixConstants.getGlyphSpacingX();

		// Start at Grid X Position
		let currentGridX = this.GRID_X;

		// Parse Text to Glyph Codes
		const GLYPH_CODES = this.SHAPE_MANAGER.parseTextToGlyphCodes(this.TEXT);

		// Add Glyph Shapes
		for (let i = 0; i < GLYPH_CODES.length; i += 1) {
			// Get Glyph Code
			const GLYPH_CODE = GLYPH_CODES[i];

			// Create Shape Glyph
			const SHAPE = this.SHAPE_MANAGER.addShapeGlyph(
				GLYPH_CODE,
				currentGridX,
				this.GRID_Y,
				this.DELAY + i * this.DELAY_GLYPH,
				this.FILL_TYPE,
				this.FILL_STRATEGY_TYPE,
				this.DRAW_TYPE,
			);

			if (SHAPE) {
				// Store
				this.SHAPES.push(SHAPE);

				// Increment Current Grid X Position
				currentGridX += SHAPE.getGlyphWidth() + GLYPH_SPACING_X;
			} else {
				ApplicationLogger.warn(
					`ComponentGlyphBox Glyph '${GLYPH_CODE}' not found`,
					this.#LOG_LEVEL,
				);
			}
		}
	}

	// __________________________________________________________________ Access

	getGridWidth() {
		return this.GRID_WIDTH;
	}
}
