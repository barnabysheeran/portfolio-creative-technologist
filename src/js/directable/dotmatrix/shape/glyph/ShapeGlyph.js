import ApplicationLogger from '../../../../application/ApplicationLogger.js';

import Shape from '../Shape.js';

import Fill from '../../enum/Fill.js';
import FillType from '../../enum/FillType.js';
import FillStrategy from '../../enum/FillStrategy.js';
import FillStrategyType from '../../enum/FillStrategyType.js';
import DrawType from '../../enum/DrawType.js';

export default class ShapeGlyph extends Shape {
	#positionGridGlyphs = [];
	#glyphWidth = 0;
	#glyphHeight = 0;

	#LOG_LEVEL = -1; // 6;

	// _________________________________________________________________________

	constructor(
		dotManager,
		gridX,
		gridY,
		glyphData,
		delay = 0,
		fillType = FillType.PassThrough,
		fillStrategyType = FillStrategyType.PassThrough,
		drawType = DrawType.Fill,
	) {
		super(dotManager, delay, drawType);

		ApplicationLogger.log(`ShapeGlyph`, this.#LOG_LEVEL);

		// Get Glyph Data
		this.#positionGridGlyphs = glyphData.points;
		this.#glyphWidth = this.#positionGridGlyphs[0].length;
		this.#glyphHeight = this.#positionGridGlyphs.length;

		// Store Initial Position Grids
		for (let y = 0; y < this.#glyphHeight; y += 1) {
			for (let x = 0; x < this.#glyphWidth; x += 1) {
				if (this.getIsFilled(x, y)) {
					this.positionGrids.push([gridX + x, gridY + y]);
				}
			}
		}

		// Fill Type
		Fill.apply(fillType, this.positionGrids);

		// Fill Strategy Type
		FillStrategy.apply(fillStrategyType, this.positionGrids);
	}

	getIsFilled(x, y) {
		// Check bounds
		if (y < 0 || y >= this.#glyphHeight || x < 0 || x >= this.#glyphWidth) {
			return false;
		}

		return this.#positionGridGlyphs[y][x] === 1;
	}

	getGlyphWidth() {
		return this.#glyphWidth;
	}

	getGlyphHeight() {
		return this.#glyphHeight;
	}
}
