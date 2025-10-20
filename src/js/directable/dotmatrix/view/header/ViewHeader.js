import ApplicationDispatcher from '../../../../application/ApplicationDispatcher.js';

import GridData from '../../../../grid/GridData.js';
import InteractiveSurface from '../../../../interactive/InteractiveSurface.js';

import DotMatrixView from '../DotMatrixView.js';

import DirectableDotMatrixConstants from '../../DirectableDotMatrixConstants.js';

import FillType from '../../enum/FillType.js';
import FillStrategyType from '../../enum/FillStrategyType.js';
import DrawType from '../../enum/DrawType.js';

import ComponentGlyphLineCentered from '../../component/glyph/ComponentGlyphLineCentered.js';

export default class DotMatrixViewHeader extends DotMatrixView {
	#DELAY_ROLLOVER_REDRAW = 6;

	#gridXCenteredStart = 0;
	#gridY = 0;
	#gridWidthGlyphs = 0;

	#LINE_HEIGHT_ABOVE_HEADER = 2;

	#DELAY_GLYPH_IN = 2;
	#DELAY_GLYPH_OUT = 0;
	#delayGlyph;

	#isMenuOpen = false;

	// ______________________________________________________________ Start Stop

	start(delayFrames) {
		super.start(delayFrames);

		// Order Important - Draw Stores Grid Position Information

		// Set Delay Glyph
		this.#delayGlyph = this.#DELAY_GLYPH_IN;

		// Draw
		this.#drawButtonUnsurrounded();

		// Create Interactive Block - After Draw
		this.#createInteractiveBlock();
	}

	stop(delayFrames = 0) {
		// Super Removes Interactive Blocks
		super.stop(delayFrames);

		// Set Delay Glyph
		this.#delayGlyph = this.#DELAY_GLYPH_OUT;

		// Undraw
		this.draw(delayFrames, DrawType.Clear);
	}

	// ____________________________________________________________________ Draw

	draw(delayFrames, drawType) {
		super.draw(delayFrames, drawType);

		// Get Height
		const LINE_HEIGHT = DirectableDotMatrixConstants.getLineHeightInGridCells();
		const LINE_HEIGHT_HEADER =
			DirectableDotMatrixConstants.getHeaderHeightInLines();

		// Constant Position
		this.#gridY =
			LINE_HEIGHT * (LINE_HEIGHT_HEADER - this.#LINE_HEIGHT_ABOVE_HEADER);

		// Create Glyph Line Centered Component
		const COMPONENT = new ComponentGlyphLineCentered(
			this.SHAPE_MANAGER,
			'Menu',
			this.#gridY,
			delayFrames +
				DirectableDotMatrixConstants.getDelayFromGridPosition(0, this.#gridY),
			this.#delayGlyph,
			FillType.PassThrough,
			FillStrategyType.PassThrough,
			drawType,
		);

		this.COMPONENT_MANAGER.addComponent(COMPONENT);

		// Store Component Details
		this.#gridXCenteredStart = COMPONENT.getGridXCenteredStart();
		this.#gridWidthGlyphs = COMPONENT.getGridWidth();
	}

	// _____________________________________________________________ Interaction

	#createInteractiveBlock() {
		// Get Height
		const CHARACTER_HEIGHT = DirectableDotMatrixConstants.getCharacterHeight();

		// Create Interactive Block
		const INTERACTIVE_BLOCK = InteractiveSurface.createBlock(
			this.#gridXCenteredStart * GridData.getGridCellWidthPx(),
			this.#gridY * GridData.getGridCellHeightPx(),
			this.#gridWidthGlyphs * GridData.getGridCellWidthPx(),
			CHARACTER_HEIGHT * GridData.getGridCellHeightPx(),
			this.onButtonMenuClick.bind(this),
			this.onButtonMenuOver.bind(this),
			this.onButtonMenuOut.bind(this),
		);

		// Store
		this.INTERACTIVE_BLOCK_IDS.push(INTERACTIVE_BLOCK);
	}

	onButtonMenuClick() {
		// Toggle Menu
		if (this.#isMenuOpen === true) {
			// Project Menu Close
			ApplicationDispatcher.dispatch('project-menu-close');
			// Inactive
			this.#isMenuOpen = false;
		} else {
			// Project Menu Open
			ApplicationDispatcher.dispatch('project-menu-open');
			// Active
			this.#isMenuOpen = true;
		}
	}

	onButtonMenuOver() {
		if (this.#isMenuOpen === false) {
			this.#drawButtonSurrounded();
		} else {
			this.#drawButtonUnsurrounded();
		}
	}

	onButtonMenuOut() {
		if (this.#isMenuOpen === false) {
			this.#drawButtonUnsurrounded();
		} else {
			this.#drawButtonSurrounded();
		}
	}

	// ____________________________________________________________ Is Menu Open

	setIsMenuOpen(isMenuOpen) {
		// Store
		this.#isMenuOpen = isMenuOpen;

		// Set
		if (this.#isMenuOpen === true) {
			this.#drawButtonSurrounded();
		} else {
			this.#drawButtonUnsurrounded();
		}
	}

	// __________________________________________________________________ Button

	#drawButtonSurrounded() {
		// Draw Surrounding Rectangle
		this.#drawSurroundingRectangle(0, DrawType.Fill);

		// Clear Draw
		this.draw(this.#DELAY_ROLLOVER_REDRAW, DrawType.Clear);
	}

	#drawButtonUnsurrounded() {
		// Clear Surrounding Rectangle
		this.#drawSurroundingRectangle(0, DrawType.Clear);

		// Fill Draw
		this.draw(this.#DELAY_ROLLOVER_REDRAW, DrawType.Fill);
	}

	// _______________________________________________________________ Rectangle

	#drawSurroundingRectangle(delayFrames, drawType) {
		// Get Height
		const LINE_HEIGHT = DirectableDotMatrixConstants.getLineHeightInGridCells();

		// Position and Size
		const GRID_X = this.#gridXCenteredStart - 1;
		const GRID_Y = this.#gridY - 1;
		const GRID_WIDTH = this.#gridWidthGlyphs + 2;
		const GRID_HEIGHT = LINE_HEIGHT * 1;

		this.addRectanglesBlock(
			this.SHAPE_MANAGER,
			this.COMPONENT_MANAGER,
			GRID_X,
			GRID_Y,
			GRID_WIDTH,
			GRID_HEIGHT,
			delayFrames,
			FillType.PassThrough,
			FillStrategyType.PassThrough,
			drawType,
		);
	}
}
