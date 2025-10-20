export default class DirectableDotMatrixConstants {
	// ____________________________________________________________________ Line

	static #LINE_HEIGHT_IN_GRID_CELLS = 7;

	static getLineHeightInGridCells() {
		return this.#LINE_HEIGHT_IN_GRID_CELLS;
	}

	// __________________________________________________________________ Header

	static #HEADER_HEIGHT_IN_LINES = 5;

	static getHeaderHeightInLines() {
		return this.#HEADER_HEIGHT_IN_LINES;
	}

	static getHeaderHeightInGridCells() {
		return this.#HEADER_HEIGHT_IN_LINES * this.#LINE_HEIGHT_IN_GRID_CELLS;
	}

	// __________________________________________________________________ Footer

	static #FOOTER_HEIGHT_IN_LINES = 7;

	static getFooterHeightInLines() {
		return this.#FOOTER_HEIGHT_IN_LINES;
	}

	static getFooterHeightInGridCells() {
		return this.#FOOTER_HEIGHT_IN_LINES * this.#LINE_HEIGHT_IN_GRID_CELLS;
	}

	// ___________________________________________________________________ Glyph

	static #CHARACTER_HEIGHT = 5;

	static getCharacterHeight() {
		return this.#CHARACTER_HEIGHT;
	}

	static #GLYPH_WIDTH_SPACE = 3;

	static getWidthSpace() {
		return this.#GLYPH_WIDTH_SPACE;
	}

	// _________________________________________________________________________

	static #GLYPH_SPACING_X = 1;

	static getGlyphSpacingX() {
		return this.#GLYPH_SPACING_X;
	}

	// ___________________________________________________ Delay Page Transition

	// TODO Move to Views

	static #DELAY_PAGE_TRANSITION = 20;

	static getDelayPageTransition() {
		return this.#DELAY_PAGE_TRANSITION;
	}

	// _____________________________________________________ DelayGlyph Position

	static getDelayFromGridPosition(gridX, gridY) {
		// Calculate Delay
		const DELAY = gridX * 1 + gridY * 1;

		return Math.floor(DELAY);
	}

	static getDelayFromGridPositionQuadratic(gridY, gridYStart, gridYMax) {
		// Calculate Delay
		const DELAY = Math.floor(
			Math.pow(gridY - gridYStart, 2) / Math.pow(gridYMax - gridYStart, 2),
		);

		return DELAY;
	}
}
