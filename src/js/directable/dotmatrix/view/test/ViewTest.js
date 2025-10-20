import GridData from '../../../../grid/GridData.js';

import DotMatrixView from '../DotMatrixView.js';

import DirectableDotMatrixConstants from '../../DirectableDotMatrixConstants.js';

import FillType from '../../enum/FillType.js';
import FillStrategyType from '../../enum/FillStrategyType.js';
import DrawType from '../../enum/DrawType.js';

import ComponentLineWidthFull from '../../component/line/ComponentLineWidthFull.js';
import ComponentGlyphBox from '../../component/glyph/ComponentGlyphBox.js';
import ComponentGlyphBoxWidthFull from '../../component/glyph/ComponentGlyphBoxWidthFull.js';
import ComponentRectangle from '../../component/primative/ComponentRectangle.js';

export default class DotMatrixViewTest extends DotMatrixView {
	#STRING_CHAR_TEST_1 = `- _ / : ; , . ' ! "`;
	#STRING_CHAR_TEST_2 = `^ < {heart} > ^`;

	#STRING_CHAR_TEST_BB = '{wing-left} {skull} {wing-right}';

	// ___________________________________________________________________ Start

	start(delayFrames = 0) {
		super.start(delayFrames);

		// Start
		this.draw(delayFrames);
	}

	stop(delayFrames = 0) {
		super.stop(delayFrames);

		// Stop
		this.undraw(delayFrames);
	}

	// ____________________________________________________________________ Draw

	draw(delayFrames, drawType) {
		super.draw(delayFrames, drawType);

		// Get Line Height
		const LINE_HEIGHT = DirectableDotMatrixConstants.getLineHeightInGridCells();

		// Get Grid Data
		const GRID_WIDTH_IN_CELLS = GridData.getGridWidthInCells();
		const GRID_HEIGHT_IN_CELLS = GridData.getGridHeightInCells();

		const GRID_WIDTH_IN_CELLS_THIRD = Math.floor(GRID_WIDTH_IN_CELLS / 3);
		const LINE_HEIGHT_MAX = Math.floor(GRID_HEIGHT_IN_CELLS / LINE_HEIGHT);

		let gridY = 2;

		// Component Line Top
		const LINE_TOP = new ComponentLineWidthFull(
			this.SHAPE_MANAGER,
			LINE_HEIGHT * gridY,
			1,
			FillType.PassThrough,
			FillStrategyType.PassThrough,
			DrawType.Fill,
		);

		// Store
		this.COMPONENT_MANAGER.addComponent(LINE_TOP);

		// Next
		gridY += 2;

		// Create Component ABC
		const COMPONENT_ABC = new ComponentGlyphBox(
			this.SHAPE_MANAGER,
			'ABCDEFGHIJKLMNOPQRSTUVWXYZ',
			0,
			LINE_HEIGHT * gridY,
			100,
			50,
			1,
			FillType.PassThrough,
			FillStrategyType.PassThrough,
		);

		this.COMPONENT_MANAGER.addComponent(COMPONENT_ABC);

		// Next
		gridY += 2;

		// Create Component abc
		const COMPONENT_abc = new ComponentGlyphBox(
			this.SHAPE_MANAGER,
			'abcd efgh ijkl mnop qrst uvwx yz',
			0,
			LINE_HEIGHT * gridY,
			100,
			50,
			1,
			FillType.PassThrough,
			FillStrategyType.PassThrough,
		);

		this.COMPONENT_MANAGER.addComponent(COMPONENT_abc);

		// Next
		gridY += 2;

		// Add Component 0001
		const COMPONENT_0001 = new ComponentGlyphBox(
			this.SHAPE_MANAGER,
			'0123456789',
			0,
			LINE_HEIGHT * gridY,
			100,
			50,
			1,
			FillType.PassThrough,
			FillStrategyType.PassThrough,
		);

		this.COMPONENT_MANAGER.addComponent(COMPONENT_0001);

		// Next
		gridY += 2;

		// Add Component Character Test 1
		const COMPONENT_CHARACTER_TEST_1 = new ComponentGlyphBox(
			this.SHAPE_MANAGER,
			this.#STRING_CHAR_TEST_1,
			0,
			LINE_HEIGHT * gridY,
			100,
			50,
			1,
			FillType.PassThrough,
			FillStrategyType.PassThrough,
		);

		this.COMPONENT_MANAGER.addComponent(COMPONENT_CHARACTER_TEST_1);

		// Next
		gridY += 2;

		// Add Component Character Test 2
		const COMPONENT_CHARACTER_TEST_2 = new ComponentGlyphBox(
			this.SHAPE_MANAGER,
			this.#STRING_CHAR_TEST_2,
			0,
			LINE_HEIGHT * gridY,
			100,
			50,
			1,
			FillType.PassThrough,
			FillStrategyType.PassThrough,
		);

		this.COMPONENT_MANAGER.addComponent(COMPONENT_CHARACTER_TEST_2);

		// Next
		gridY += 2;

		// Add Component Character Test BB
		const COMPONENT_CHARACTER_TEST_BB = new ComponentGlyphBox(
			this.SHAPE_MANAGER,
			this.#STRING_CHAR_TEST_BB,
			0,
			LINE_HEIGHT * gridY,
			100,
			50,
			1,
			FillType.PassThrough,
			FillStrategyType.PassThrough,
		);

		this.COMPONENT_MANAGER.addComponent(COMPONENT_CHARACTER_TEST_BB);

		// Next
		gridY += 2;

		// Rectangles
		const RECTANGLE_WIDTH = LINE_HEIGHT * 1;
		const RECTANGLE_HEIGHT = LINE_HEIGHT * 1;

		// Create Component Rectangle A
		const COMPONENT_RECTANGLE_A = new ComponentRectangle(
			this.SHAPE_MANAGER,
			0,
			LINE_HEIGHT * gridY,
			RECTANGLE_WIDTH,
			RECTANGLE_HEIGHT,
			GRID_WIDTH_IN_CELLS_THIRD,
			FillType.PassThrough,
			FillStrategyType.Reverse,
		);

		this.COMPONENT_MANAGER.addComponent(COMPONENT_RECTANGLE_A);

		// Create Component Rectangle B
		const COMPONENT_RECTANGLE_B = new ComponentRectangle(
			this.SHAPE_MANAGER,
			RECTANGLE_WIDTH + 2,
			LINE_HEIGHT * gridY,
			RECTANGLE_WIDTH,
			RECTANGLE_HEIGHT,
			GRID_WIDTH_IN_CELLS - GRID_WIDTH_IN_CELLS_THIRD,
			FillType.PassThrough,
			FillStrategyType.Random,
		);

		this.COMPONENT_MANAGER.addComponent(COMPONENT_RECTANGLE_B);

		// Create Component Rectangle C
		const COMPONENT_RECTANGLE_C = new ComponentRectangle(
			this.SHAPE_MANAGER,
			RECTANGLE_WIDTH * 2 + 4,
			LINE_HEIGHT * gridY,
			RECTANGLE_WIDTH,
			RECTANGLE_HEIGHT,
			GRID_WIDTH_IN_CELLS,
			FillType.PassThrough,
			FillStrategyType.PassThrough,
		);

		this.COMPONENT_MANAGER.addComponent(COMPONENT_RECTANGLE_C);

		// Next
		gridY += 2;

		// Dummy Text with Line Height
		const BLOCK_GRID_TOP = gridY;
		const BLOCK_GRID_BOTTOM = gridY + 2;

		for (let i = BLOCK_GRID_TOP; i < BLOCK_GRID_BOTTOM; i += 1) {
			// Create Component
			const Y = LINE_HEIGHT * i;

			const COMPONENT = new ComponentGlyphBoxWidthFull(
				this.SHAPE_MANAGER,
				'HELLO',
				0,
				LINE_HEIGHT * Y,
				DirectableDotMatrixConstants.getDelayFromGridPosition(0, Y),
				FillType.PassThrough,
				FillStrategyType.PassThrough,
			);

			// Store
			this.COMPONENT_MANAGER.addComponent(COMPONENT);
		}

		// Create Component Line Bottom
		const LINE_BOTTOM = new ComponentLineWidthFull(
			this.SHAPE_MANAGER,
			LINE_HEIGHT * (LINE_HEIGHT_MAX - 2),
			1,
			FillType.PassThrough,
			FillStrategyType.PassThrough,
		);

		this.COMPONENT_MANAGER.addComponent(LINE_BOTTOM);
	}

	// __________________________________________________________________ Undraw

	undraw() {}

	// ____________________________________________________________________ Tick

	tick() {
		// Not calling super.tick

		// Active ?
		if (this.isActive === false) {
			return;
		}

		const RANDOM_DRAW = Math.random();

		if (RANDOM_DRAW < 0.02) {
			// Draw
			this.draw();
		}

		if (RANDOM_DRAW > 0.99) {
			// Undraw
			this.undraw();
		}
	}
}
