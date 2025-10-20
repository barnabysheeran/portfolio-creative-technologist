import GridData from '../../../../grid/GridData.js';

import DotMatrixView from '../DotMatrixView.js';

import DirectableDotMatrixConstants from '../../DirectableDotMatrixConstants.js';

import FillType from '../../enum/FillType.js';
import FillStrategyType from '../../enum/FillStrategyType.js';
import DrawType from '../../enum/DrawType.js';

import ComponentGlyphBoxWidthFull from '../../component/glyph/ComponentGlyphBoxWidthFull.js';

export default class DotMatrixViewIntro extends DotMatrixView {
	#DRAW_GLYPH_NAME_LIST = [
		'{heart}',
		'1',
		'.',
		'0',
		'/',
		'0',
		'{smile}',
		'.',
		'.,',
		'-',
	];

	#drawGlyphNameIndex = -1;

	#DELAY_GLYPH_IN = 2;
	#DELAY_GLYPH_OUT = 0;
	#delayGlyph;

	// ___________________________________________________________________ Start

	start(delayFrames) {
		super.start(delayFrames);

		// Set Delay Glyph
		this.#delayGlyph = this.#DELAY_GLYPH_IN;

		// Reset Draw Glyph Index
		this.#drawGlyphNameIndex = -1;

		// Start
		this.draw(delayFrames, DrawType.Fill);
	}

	stop(delayFrames) {
		super.stop(delayFrames);

		// Set Delay Glyph
		this.#delayGlyph = this.#DELAY_GLYPH_OUT;

		// Reset Draw Glyph Index
		this.#drawGlyphNameIndex = -1;

		// Stop
		this.draw(delayFrames, DrawType.Clear);
	}

	// ____________________________________________________________________ Draw

	draw(delayFrames, drawType) {
		super.draw(delayFrames, drawType);

		// Get Height
		const LINE_HEIGHT = DirectableDotMatrixConstants.getLineHeightInGridCells();
		const LINE_HEIGHT_HEADER =
			DirectableDotMatrixConstants.getHeaderHeightInLines();
		const LINE_HEIGHT_FOOTER =
			DirectableDotMatrixConstants.getFooterHeightInLines();

		// Get Grid Data
		const GRID_HEIGHT_IN_CELLS = GridData.getGridHeightInCells();
		const GRID_HEIGHT_IN_LINES = Math.floor(GRID_HEIGHT_IN_CELLS / LINE_HEIGHT);

		// Calculate
		const LINE_HEIGHT_MAX = GRID_HEIGHT_IN_LINES - LINE_HEIGHT_FOOTER;

		// Add Text with Line Height
		for (let i = LINE_HEIGHT_HEADER + 1; i < LINE_HEIGHT_MAX; i += 1) {
			// Create Component
			const GRID_Y = LINE_HEIGHT * i;

			const DELAY =
				delayFrames +
				DirectableDotMatrixConstants.getDelayFromGridPositionQuadratic(
					GRID_Y,
					LINE_HEIGHT_HEADER,
					LINE_HEIGHT_MAX,
				) *
					10;

			const COMPONENT = new ComponentGlyphBoxWidthFull(
				this.SHAPE_MANAGER,
				// this.#drawGlyphName,
				this.#getNextDrawGlyphName(),
				0,
				GRID_Y,
				DELAY,
				this.#delayGlyph,
				FillType.PassThrough,
				FillStrategyType.PassThrough,
				drawType,
			);

			// Store
			this.COMPONENT_MANAGER.addComponent(COMPONENT);
		}
	}

	// ___________________________________________________________ Draw Complete

	onDrawComplete() {
		super.onDrawComplete();

		// Reset Draw Glyph Index
		this.#drawGlyphNameIndex = -1;

		// Clear
		this.draw(0, DrawType.Clear);

		// Reset Draw Glyph Index
		this.#drawGlyphNameIndex = -1;

		// TODO Hard Coded Delay
		this.draw(120, DrawType.Fill);
	}

	// ___________________________________________________________________ Glyph

	#getNextDrawGlyphName() {
		this.#drawGlyphNameIndex += 1;

		if (this.#drawGlyphNameIndex >= this.#DRAW_GLYPH_NAME_LIST.length) {
			this.#drawGlyphNameIndex = 0;
		}

		return this.#DRAW_GLYPH_NAME_LIST[this.#drawGlyphNameIndex];
	}
}
