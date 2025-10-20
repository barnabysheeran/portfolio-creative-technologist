import GridData from '../../../../grid/GridData.js';

import Component from '../Component.js';

import DirectableDotMatrixConstants from '../../DirectableDotMatrixConstants.js';

export default class ComponentGlyphBoxWidthFull extends Component {
	// Unique Parameters
	TEXT;

	// _________________________________________________________________________

	constructor(
		shapeManager,
		text,
		gridX,
		gridY,
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

		// Create Shape
		this.#createShape();
	}

	// ____________________________________________________________ Create Shape

	#createShape() {
		// Get Constants
		const GLYPH_SPACING_X = DirectableDotMatrixConstants.getGlyphSpacingX();

		// Get Grid Data
		const GRID_WIDTH_IN_CELLS = GridData.getGridWidthInCells();

		// Parse Text to Glyph Codes
		const GLYPH_CODES = this.SHAPE_MANAGER.parseTextToGlyphCodes(this.TEXT);
		const GLYPH_CODES_DRAW = [];

		// Add Characters to Text Pattern Stopping Before Grid Width
		let glyphIndex = 0;
		let currentWidth = 0;

		while (currentWidth < GRID_WIDTH_IN_CELLS) {
			// Get Text Character at Current Index
			const GLYPH_CODE = GLYPH_CODES[glyphIndex];

			// Get Glyph Width
			const GLYPH_WIDTH = this.SHAPE_MANAGER.getShapeGlyphWidth(GLYPH_CODE);

			if (currentWidth + GLYPH_WIDTH > GRID_WIDTH_IN_CELLS) {
				break;
			}

			// Add Character to Text Pattern
			// TEXT_PATTERN += GLYPH_CODE;
			GLYPH_CODES_DRAW.push(GLYPH_CODE);

			// Increment current width by Glyph Width and Spacing
			currentWidth += GLYPH_WIDTH + GLYPH_SPACING_X;

			// Next Text Index
			glyphIndex += 1;

			// If Text Index Exceeds Text Length, Reset to Start
			if (glyphIndex >= GLYPH_CODES.length) {
				glyphIndex = 0;
			}
		}

		// Start at Grid X Position
		let currentGridX = this.GRID_X;

		// Add Letter Shapes through Text
		for (let i = 0; i < GLYPH_CODES_DRAW.length; i += 1) {
			// Get Glyph Name
			const GLYPH_CODE = GLYPH_CODES_DRAW[i];

			if (GLYPH_CODE === 'space') {
				currentGridX +=
					DirectableDotMatrixConstants.getWidthSpace() + GLYPH_SPACING_X;

				// Skip Space Glyphs
				continue;
			}

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

			// Store
			this.SHAPES.push(SHAPE);

			// Increment Current Grid X Position
			currentGridX += SHAPE.getGlyphWidth() + GLYPH_SPACING_X;
		}
	}
}
