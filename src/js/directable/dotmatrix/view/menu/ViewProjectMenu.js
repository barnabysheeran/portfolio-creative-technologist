import ApplicationDispatcher from '../../../../application/ApplicationDispatcher.js';
import DataController from '../../../../data/DataController.js';

import GridData from '../../../../grid/GridData.js';
import InteractiveSurface from '../../../../interactive/InteractiveSurface.js';

import DotMatrixView from '../DotMatrixView.js';

import DirectableDotMatrixConstants from '../../DirectableDotMatrixConstants.js';

import FillType from '../../enum/FillType.js';
import FillStrategyType from '../../enum/FillStrategyType.js';
import DrawType from '../../enum/DrawType.js';

import ComponentGlyphLineCentered from '../../component/glyph/ComponentGlyphLineCentered.js';

export default class DotMatrixViewProjectMenu extends DotMatrixView {
	#DELAY_ROLLOVER_REDRAW = 24;

	#DELAY_FRAMES_AUTO_REFRESH_MAX = 60 * 4;
	#delayFramesAutoRefresh = -1;

	#PROJECT_IDS;
	#GRID_X_CENTERED_STARTS;
	#GRID_YS;
	#GRID_WIDTH_GLYPHS;

	#IS_OVERS;
	#REQUIRES_UPDATES;

	#DELAY_GLYPH_IN = 4;
	#DELAY_GLYPH_OUT = 0;
	#delayGlyph = 5;

	// ______________________________________________________________ Start Stop

	start(delayFrames) {
		super.start(delayFrames);

		// Order Important - Draw Stores Grid Position Information

		// Reset
		this.#PROJECT_IDS = [];
		this.#GRID_X_CENTERED_STARTS = [];
		this.#GRID_YS = [];
		this.#GRID_WIDTH_GLYPHS = [];

		// Get Project Data
		const PROJECT_DATA = DataController.getProjects();

		// Initialise Is Overs
		this.#IS_OVERS = [];

		for (let i = 0; i < PROJECT_DATA.length; i += 1) {
			this.#IS_OVERS[i] = false;
		}

		// Initialise Requires Updates
		this.#REQUIRES_UPDATES = [];

		for (let i = 0; i < PROJECT_DATA.length; i += 1) {
			this.#REQUIRES_UPDATES[i] = true;
		}

		// Set Delay Glyph
		this.#delayGlyph = this.#DELAY_GLYPH_IN;

		// Initialise Delay Frames Auto Refresh
		this.#delayFramesAutoRefresh = -1;

		// Draw
		this.draw(delayFrames, DrawType.Fill);

		// Create Interactive Blocks
		this.#createInteractiveBlocks();
	}

	stop(delayFrames) {
		// Super Removes Interactive Blocks
		super.stop(delayFrames);

		// Set Delay Glyph
		this.#delayGlyph = this.#DELAY_GLYPH_OUT;

		// Initialise Delay Frames Auto Refresh
		this.#delayFramesAutoRefresh = -1;

		// Undraw Unsurrounding Rectangles
		for (let i = 0; i < this.#PROJECT_IDS.length; i += 1) {
			this.#drawSurroundingRectangle(
				this.#PROJECT_IDS[i],
				delayFrames,
				DrawType.Clear,
			);
		}
	}

	// ____________________________________________________________________ Tick

	tick() {
		// Active ?
		if (this.isActive === false) {
			return;
		}

		// Delay Auto Refresh
		if (this.#delayFramesAutoRefresh > -1) {
			this.#delayFramesAutoRefresh -= 1;

			if (this.#delayFramesAutoRefresh === 0) {
				this.#onAutoRefresh();
			}
		}
	}

	#onAutoRefresh() {
		// End Delay
		this.#delayFramesAutoRefresh = -1;

		// Require Updates
		for (let i = 0; i < this.#REQUIRES_UPDATES.length; i += 1) {
			// TODO Hard Coded
			if (Math.random() < 0.5) {
				this.#REQUIRES_UPDATES[i] = true;

				if (Math.random() < 0.5) {
					this.#IS_OVERS[i] = true;
				} else {
					this.#IS_OVERS[i] = false;
				}
			}
		}

		// Draw
		this.draw(0, DrawType.Clear);
		this.draw(this.#DELAY_ROLLOVER_REDRAW, DrawType.Fill);
	}

	// ___________________________________________________________ Draw Complete

	onDrawComplete() {
		super.onDrawComplete();

		// Initialise Delay Frames Auto Refresh
		this.#delayFramesAutoRefresh = this.#DELAY_FRAMES_AUTO_REFRESH_MAX;
	}

	// ____________________________________________________________________ Draw

	draw(delayFrames, drawType) {
		super.draw(delayFrames, drawType);

		// Get Project Data
		const PROJECT_DATA = DataController.getProjects();

		// Get Line Heights
		const LINE_HEIGHT = DirectableDotMatrixConstants.getLineHeightInGridCells();

		// Get Width Mobile
		const IS_MOBILE = GridData.getIsMobile();

		// Get Grid Data
		const GRID_HEIGHT_IN_CELLS = GridData.getGridHeightInCells();

		// Calculate Line Distribution
		// TODO Hard Coded Values
		const LINE_SPACING = 2;
		const FREE_SPACE_PROPORTION = 0.5;
		const LINE_HEIGHT_MENU_START_MINIMUM = 7;

		const GRID_HEIGHT_IN_LINES = Math.floor(GRID_HEIGHT_IN_CELLS / LINE_HEIGHT);
		const MENU_HEIGHT_IN_LINES = PROJECT_DATA.length * LINE_SPACING;
		const FREE_SPACE_IN_LINES = GRID_HEIGHT_IN_LINES - MENU_HEIGHT_IN_LINES;

		let lineHeightMenuStart = Math.floor(
			FREE_SPACE_IN_LINES * FREE_SPACE_PROPORTION,
		);

		if (lineHeightMenuStart < LINE_HEIGHT_MENU_START_MINIMUM) {
			lineHeightMenuStart = LINE_HEIGHT_MENU_START_MINIMUM;
		}

		// Draw
		for (let i = 0; i < PROJECT_DATA.length; i += 1) {
			// Requires Update ?
			if (this.#REQUIRES_UPDATES[i] === false) {
				continue;
			}

			// Get Project Data Item
			const PROJECT_DATA_ITEM = PROJECT_DATA[i];

			// Grid Y
			const GRID_Y = LINE_HEIGHT * (lineHeightMenuStart + i * LINE_SPACING);

			// Text
			let text = PROJECT_DATA_ITEM['name'];

			if (IS_MOBILE === true) {
				text = PROJECT_DATA_ITEM['name-short'];
			}

			// Draw Mode
			let drawType = DrawType.Fill;

			// Is Over ?
			if (this.#IS_OVERS[i] === true) {
				drawType = DrawType.Clear;
			}

			// Create Glyph Line
			const COMPONENT = new ComponentGlyphLineCentered(
				this.SHAPE_MANAGER,
				text,
				GRID_Y,
				delayFrames + this.#DELAY_ROLLOVER_REDRAW,
				this.#delayGlyph,
				FillType.PassThrough,
				FillStrategyType.PassThrough,
				drawType,
			);

			// Store
			this.COMPONENT_MANAGER.addComponent(COMPONENT);

			// Store Component Details
			this.#PROJECT_IDS[i] = PROJECT_DATA_ITEM['id'];

			this.#GRID_X_CENTERED_STARTS[i] = COMPONENT.getGridXCenteredStart();
			this.#GRID_YS[i] = GRID_Y;
			this.#GRID_WIDTH_GLYPHS[i] = COMPONENT.getGridWidth();

			// Rectangle
			if (this.#IS_OVERS[i] === true) {
				// Is Over
				this.#drawSurroundingRectangle(
					this.#PROJECT_IDS[i],
					delayFrames,
					DrawType.Fill,
				);
			} else {
				// Is Not Over
				this.#drawSurroundingRectangle(
					this.#PROJECT_IDS[i],
					delayFrames,
					DrawType.Clear,
				);
			}

			// Updated
			this.#REQUIRES_UPDATES[i] = false;
		}
	}

	// _____________________________________________________________ Interaction

	#createInteractiveBlocks() {
		// Get Height
		const CHARACTER_HEIGHT = DirectableDotMatrixConstants.getCharacterHeight();

		for (let i = 0; i < this.#PROJECT_IDS.length; i += 1) {
			const INTERACTIVE_BLOCK_ID = InteractiveSurface.createBlock(
				this.#GRID_X_CENTERED_STARTS[i] * GridData.getGridCellWidthPx(),
				this.#GRID_YS[i] * GridData.getGridCellHeightPx(),
				this.#GRID_WIDTH_GLYPHS[i] * GridData.getGridCellWidthPx(),
				CHARACTER_HEIGHT * GridData.getGridCellHeightPx(),
				this.onButtonMenuClick.bind(this),
				this.onButtonMenuOver.bind(this),
				this.onButtonMenuOut.bind(this),
				{ projectId: this.#PROJECT_IDS[i] },
			);

			// Store
			this.INTERACTIVE_BLOCK_IDS.push(INTERACTIVE_BLOCK_ID);
		}
	}

	onButtonMenuClick(clickData) {
		// Dispatch Event
		ApplicationDispatcher.dispatch('view-project-menu-select', {
			projectId: clickData.projectId,
		});
	}

	onButtonMenuOver(clickData) {
		// Get Project Index
		const PROJECT_INDEX = this.#PROJECT_IDS.indexOf(clickData.projectId);

		// End Delay Frames Auto Refresh
		this.#delayFramesAutoRefresh = -1;

		// Is Over
		this.#IS_OVERS[PROJECT_INDEX] = true;

		// Require Update
		this.#REQUIRES_UPDATES[PROJECT_INDEX] = true;

		// Draw
		this.draw(0, DrawType.Clear);
		this.draw(this.#DELAY_ROLLOVER_REDRAW, DrawType.Fill);
	}

	onButtonMenuOut(clickData) {
		// Get Project Index
		const PROJECT_INDEX = this.#PROJECT_IDS.indexOf(clickData.projectId);

		// End Delay Frames Auto Refresh
		this.#delayFramesAutoRefresh = -1;

		// Is Not Over
		this.#IS_OVERS[PROJECT_INDEX] = false;

		// Require Update
		this.#REQUIRES_UPDATES[PROJECT_INDEX] = true;

		// Draw
		this.draw(0, DrawType.Clear);
		this.draw(this.#DELAY_ROLLOVER_REDRAW, DrawType.Fill);
	}

	// ______________________________________________________________ Rectangles

	#drawSurroundingRectangle(projectId, delayFrames, drawType) {
		// Get Project Index
		const PROJECT_INDEX = this.#PROJECT_IDS.indexOf(projectId);

		// Get Height
		const LINE_HEIGHT = DirectableDotMatrixConstants.getLineHeightInGridCells();

		// Position
		const GRID_X = this.#GRID_X_CENTERED_STARTS[PROJECT_INDEX] - 1;
		const GRID_Y = this.#GRID_YS[PROJECT_INDEX] - 1;

		// Size
		const GRID_WIDTH = this.#GRID_WIDTH_GLYPHS[PROJECT_INDEX] + 2;
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
			FillStrategyType.Reverse,
			drawType,
		);
	}
}
