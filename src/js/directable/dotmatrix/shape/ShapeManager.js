import ApplicationLogger from '../../../application/ApplicationLogger.js';

import FillType from '../enum/FillType.js';
import FillStrategyType from '../enum/FillStrategyType.js';
import DrawType from '../enum/DrawType.js';

import ShapeLineHorizontal from './line/ShapeLineHorizontal.js';
import ShapeRectangle from './primative/ShapeRectangle.js';

import SHAPE_GLYPH_DATA from './glyph/ShapeGlyphData.js';
import ShapeGlyph from './glyph/ShapeGlyph.js';

export default class ShapeManager {
	#DOT_MANAGER;

	#SHAPES = [];

	#LOG_LEVEL = -1; // 4;

	// _________________________________________________________________________

	constructor(dotManager) {
		ApplicationLogger.log('ShapeManager', this.#LOG_LEVEL);

		// Store
		this.#DOT_MANAGER = dotManager;
	}

	// ___________________________________________________________________ Reset

	reset() {
		ApplicationLogger.log('ShapeManager reset', this.#LOG_LEVEL);

		// Clear Shapes Array
		this.#SHAPES = [];
	}

	// __________________________________________________________________ Remove

	removeShape(shapeId) {
		ApplicationLogger.log(
			`ShapeManager removeShape ${shapeId}`,
			this.#LOG_LEVEL,
		);

		// Find Index by ID
		for (let i = 0; i < this.#SHAPES.length; i += 1) {
			if (this.#SHAPES[i].getShapeId() === shapeId) {
				// Remove Shape
				this.#SHAPES.splice(i, 1);

				ApplicationLogger.log(` - removed ${shapeId}`, this.#LOG_LEVEL);

				return true;
			}
		}
	}

	// _________________________________________________________ Line Horizontal

	addShapeLineHorizontal(
		gridX,
		gridY,
		length,
		delay = 0,
		fillType = FillType.PassThrough,
		fillStrategyType = FillStrategyType.PassThrough,
		drawType = DrawType.Fill,
	) {
		// Create Shape
		const SHAPE = new ShapeLineHorizontal(
			this.#DOT_MANAGER,
			gridX,
			gridY,
			length,
			delay,
			fillType,
			fillStrategyType,
			drawType,
		);

		// Store
		this.#SHAPES.push(SHAPE);

		// Return
		return SHAPE;
	}

	// _______________________________________________________________ Rectangle

	addShapeRectangle(
		gridX,
		gridY,
		gridWidth,
		gridHeight,
		delay = 0,
		fillType = FillType.PassThrough,
		fillStrategyType = FillStrategyType.PassThrough,
		drawType = DrawType.Fill,
	) {
		// Create Shape
		const SHAPE = new ShapeRectangle(
			this.#DOT_MANAGER,
			gridX,
			gridY,
			gridWidth,
			gridHeight,
			delay,
			fillType,
			fillStrategyType,
			drawType,
		);

		// Store
		this.#SHAPES.push(SHAPE);

		// Return
		return SHAPE;
	}

	// ___________________________________________________________________ Glyph

	addShapeGlyph(
		glyphCode,
		gridX,
		gridY,
		delay = 0,
		fillType = FillType.PassThrough,
		fillStrategyType = FillStrategyType.PassThrough,
		drawType = DrawType.Fill,
	) {
		const glyphData = this.#getShapeGlyphData(glyphCode);

		if (!glyphData) {
			ApplicationLogger.warn(
				`ShapeManager addShapeGlyph Unknown glyphCode '${glyphCode}'`,
				this.#LOG_LEVEL,
			);
			return null;
		}

		// Create Shape
		const SHAPE = new ShapeGlyph(
			this.#DOT_MANAGER,
			gridX,
			gridY,
			glyphData,
			delay,
			fillType,
			fillStrategyType,
			drawType,
		);

		// Store
		this.#SHAPES.push(SHAPE);

		// Return
		return SHAPE;
	}

	#getShapeGlyphData(glyphCode) {
		// Try direct match first (for special chars and multi-char keys like 'heart')
		let glyphData = SHAPE_GLYPH_DATA[glyphCode];
		if (glyphData) return glyphData;

		// Fallback to uppercase for standard alphabet
		const upperChar = glyphCode.toUpperCase();
		glyphData = SHAPE_GLYPH_DATA[upperChar];

		if (!glyphData) {
			ApplicationLogger.warn(
				`ShapeManager getShapeGlyphData Unknown glyphCode '${glyphCode}'`,
				this.#LOG_LEVEL,
			);
			return undefined;
		}

		return glyphData;
	}

	getShapeGlyphWidth(glyphCode) {
		const glyphData = this.#getShapeGlyphData(glyphCode);

		if (!glyphData) {
			return 0;
		}

		return glyphData.points[0].length;
	}

	getShapeGlyphHeight(glyphCode) {
		const glyphData = this.#getShapeGlyphData(glyphCode);

		if (!glyphData) {
			return 0;
		}

		return glyphData.points.length;
	}

	// _____________________________________________________________ Glyph Codes

	// Non-Standard Glyphs are enclosed in curly braces {}, e.g. {heart}

	parseTextToGlyphCodes(text) {
		const GLYPH_CODES = [];

		let i = 0;

		while (i < text.length) {
			const char = text[i];

			if (char === '{') {
				const endIndex = text.indexOf('}', i);
				if (endIndex !== -1) {
					const glyph = text.substring(i + 1, endIndex);
					GLYPH_CODES.push(glyph);
					i = endIndex + 1;
				} else {
					// Treat as a literal character if no closing brace is found
					GLYPH_CODES.push(char);
					i += 1;
				}
			} else if (char === ' ') {
				GLYPH_CODES.push('space');
				i += 1;
			} else {
				GLYPH_CODES.push(char);
				i += 1;
			}
		}

		return GLYPH_CODES;
	}
}
