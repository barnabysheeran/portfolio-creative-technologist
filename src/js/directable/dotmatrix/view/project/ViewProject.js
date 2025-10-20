import DataController from '../../../../data/DataController.js';

import DotMatrixView from '../DotMatrixView.js';

import DirectableDotMatrixConstants from '../../DirectableDotMatrixConstants.js';

import FillType from '../../enum/FillType.js';
import FillStrategyType from '../../enum/FillStrategyType.js';
import DrawType from '../../enum/DrawType.js';

import GridData from '../../../../grid/GridData.js';
import InteractiveSurface from '../../../../interactive/InteractiveSurface.js';

import ComponentGlyphLineCentered from '../../component/glyph/ComponentGlyphLineCentered.js';

export default class ViewProject extends DotMatrixView {
	// #STRING_WINGED_SKULL = '{wing-left} {skull} {wing-right}';

	// TODO Tune with Menu Text
	#DELAY_ROLLOVER_REDRAW = 20;

	#IS_OVERS;

	#DELAY_GLYPH_IN = 2;
	#DELAY_GLYPH_OUT = 0;
	#delayGlyph;

	// ______________________________________________________________ Start Stop

	start(delayFrames) {
		super.start(delayFrames);

		// Order Important - Draw Stores Grid Position Information

		// Initialise
		this.#IS_OVERS = [];

		// Set Delay Glyph
		this.#delayGlyph = this.#DELAY_GLYPH_IN;

		// Draw
		this.draw(delayFrames, DrawType.Fill);

		// Create Interactive Blocks
		this.createInteractiveBlocks();
	}

	stop(delayFrames) {
		super.stop(delayFrames);

		// Set Delay Glyph
		this.#delayGlyph = this.#DELAY_GLYPH_OUT;

		// Undraw Unsurrounding Rectangles
		for (let i = 0; i < this.INTERACTIVE_GRID_XS.length; i += 1) {
			this.#drawSurroundingRectangle(i, delayFrames, DrawType.Clear);
		}
	}

	// ____________________________________________________________________ Draw

	draw(delayFrames, drawType) {
		super.draw(delayFrames, drawType);

		// Get Project Data
		const DATA_PROJECT = DataController.getProjectById(this.getViewId());

		// Get Heights
		const LINE_HEIGHT_IN_GRID_CELLS =
			DirectableDotMatrixConstants.getLineHeightInGridCells();

		const GRID_HEIGHT_IN_GRID_CELLS = GridData.getGridHeightInCells();

		// Get Is Mobile
		const IS_MOBILE = GridData.getIsMobile();

		// Calculate Distance from Bottom
		// TODO Hard-Coded Margin
		const ITEM_TOTAL = 4 + DATA_PROJECT['credit'].length * 2;

		let gridY =
			GRID_HEIGHT_IN_GRID_CELLS - ITEM_TOTAL * LINE_HEIGHT_IN_GRID_CELLS;

		// Add Component Name
		let textName;

		if (IS_MOBILE) {
			textName = DATA_PROJECT['name-short'];
		} else {
			textName = DATA_PROJECT['name'];
		}

		const COMPONENT_NAME = new ComponentGlyphLineCentered(
			this.SHAPE_MANAGER,
			textName,
			gridY,
			delayFrames,
			this.#delayGlyph,
			FillType.PassThrough,
			FillStrategyType.PassThrough,
			drawType,
		);

		// Store
		this.COMPONENT_MANAGER.addComponent(COMPONENT_NAME);

		// Store Interactive Grid Position
		this.INTERACTIVE_GRID_XS.push(COMPONENT_NAME.getGridXCenteredStart());
		this.INTERACTIVE_GRID_YS.push(gridY);
		this.INTERACTIVE_GLYPH_WIDTHS.push(COMPONENT_NAME.getGridWidth());

		// Add Credits
		for (let i = 0; i < DATA_PROJECT['credit'].length; i += 1) {
			// Get Credit Data
			const DATA_CREDIT = DATA_PROJECT['credit'][i];

			// Get Rollover Status
			const IS_OVER = this.#IS_OVERS[i];

			// Draw Mode
			let drawType = DrawType.Fill;

			// Is Over ?
			if (IS_OVER === true) {
				drawType = DrawType.Clear;
			}

			// Text
			let text = DATA_CREDIT['text'];

			// Next
			gridY += LINE_HEIGHT_IN_GRID_CELLS * 2;

			// Create Glyph Line
			const COMPONENT_CREDIT = new ComponentGlyphLineCentered(
				this.SHAPE_MANAGER,
				text,
				gridY,
				delayFrames + i + this.#DELAY_ROLLOVER_REDRAW,
				this.#delayGlyph,
				FillType.PassThrough,
				FillStrategyType.PassThrough,
				drawType,
			);

			// Store
			this.COMPONENT_MANAGER.addComponent(COMPONENT_CREDIT);

			// Store Interactive Grid Position
			this.INTERACTIVE_GRID_XS.push(COMPONENT_CREDIT.getGridXCenteredStart());
			this.INTERACTIVE_GRID_YS.push(gridY);
			this.INTERACTIVE_GLYPH_WIDTHS.push(COMPONENT_CREDIT.getGridWidth());

			// Rectangle
			if (IS_OVER === true) {
				// Is Over
				this.#drawSurroundingRectangle(i + 1, delayFrames, DrawType.Fill);
			} else {
				// Is Not Over
				this.#drawSurroundingRectangle(i + 1, delayFrames, DrawType.Clear);
			}
		}
	}

	// _____________________________________________________________ Interaction

	createInteractiveBlocks() {
		// Get Height
		const CHARACTER_HEIGHT = DirectableDotMatrixConstants.getCharacterHeight();

		// Create Interactive Blocks
		// +1 To Avoid Title
		for (let i = 1; i < this.INTERACTIVE_GRID_XS.length; i += 1) {
			const INTERACTIVE_BLOCK_ID = InteractiveSurface.createBlock(
				this.INTERACTIVE_GRID_XS[i] * GridData.getGridCellWidthPx(),
				this.INTERACTIVE_GRID_YS[i] * GridData.getGridCellHeightPx(),
				this.INTERACTIVE_GLYPH_WIDTHS[i] * GridData.getGridCellWidthPx(),
				CHARACTER_HEIGHT * GridData.getGridCellHeightPx(),
				this.onButtonMenuClick.bind(this),
				this.onButtonMenuOver.bind(this),
				this.onButtonMenuOut.bind(this),
				{ buttonId: i - 1 },
			);

			// Store
			this.INTERACTIVE_BLOCK_IDS.push(INTERACTIVE_BLOCK_ID);
		}
	}

	onButtonMenuClick(data) {
		// Get Project Data
		const DATA_PROJECT = DataController.getProjectById(this.getViewId());

		// Get Credit Array
		const DATA_CREDIT = DATA_PROJECT['credit'][data.buttonId];

		// Open URL
		if (DATA_CREDIT && DATA_CREDIT['url']) {
			window.open(DATA_CREDIT['url'], '_blank');
		}
	}

	onButtonMenuOver(data) {
		// Set Is Over
		this.#IS_OVERS[data.buttonId] = true;

		// Draw
		this.draw(0, DrawType.Clear);
		this.draw(this.#DELAY_ROLLOVER_REDRAW, DrawType.Fill);
	}

	onButtonMenuOut(data) {
		// Set Is Not Over
		this.#IS_OVERS[data.buttonId] = false;

		// Draw
		this.draw(0, DrawType.Clear);
		this.draw(this.#DELAY_ROLLOVER_REDRAW, DrawType.Fill);
	}

	// ______________________________________________________________ Rectangles

	#drawSurroundingRectangle(buttonIndex, delayFrames, drawType) {
		// Get Height
		const LINE_HEIGHT = DirectableDotMatrixConstants.getLineHeightInGridCells();

		// Position
		const GRID_X = this.INTERACTIVE_GRID_XS[buttonIndex] - 1;
		const GRID_Y = this.INTERACTIVE_GRID_YS[buttonIndex] - 1;

		// Size
		// TODO Hard-Coded Width
		const GRID_WIDTH = this.INTERACTIVE_GLYPH_WIDTHS[buttonIndex] + 2;
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
