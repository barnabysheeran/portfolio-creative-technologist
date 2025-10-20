import ApplicationLogger from '../../../application/ApplicationLogger.js';

import FillType from '../enum/FillType.js';
import FillStrategyType from '../enum/FillStrategyType.js';
import DrawType from '../enum/DrawType.js';

export default class Component {
	SHAPE_MANAGER;
	SHAPES = [];

	GRID_X = 0;
	GRID_Y = 0;

	FILL_TYPE;
	FILL_STRATEGY_TYPE;

	DRAW_TYPE;

	DELAY = 0;

	#LOG_LEVEL = -1; // 4;

	// _________________________________________________________________________

	constructor(
		shapeManager,
		gridX,
		gridY,
		delay = 0,
		delayGlyph = 0,
		fillType = FillType.PassThrough,
		fillStrategyType = FillStrategyType.PassThrough,
		drawType = DrawType.Fill,
	) {
		ApplicationLogger.log(
			`Component gridX ${gridX} gridY ${gridY}` +
				` delay ${delay}` +
				` fillType ${fillType} fillStrategyType ${this.FILL_STRATEGY_TYPE}` +
				` drawType ${drawType}`,
			this.#LOG_LEVEL,
		);

		// Store
		this.SHAPE_MANAGER = shapeManager;
		this.GRID_X = gridX;
		this.GRID_Y = gridY;
		this.DELAY = delay;
		this.DELAY_GLYPH = delayGlyph;
		this.FILL_TYPE = fillType;
		this.FILL_STRATEGY_TYPE = fillStrategyType;
		this.DRAW_TYPE = drawType;
	}

	// ____________________________________________________________________ Tick

	tick() {
		let isComplete = true;

		// Tick Shapes
		for (let i = 0; i < this.SHAPES.length; i += 1) {
			const IS_SHAPE_COMPLETE = this.SHAPES[i].tick();

			if (IS_SHAPE_COMPLETE === false) {
				isComplete = false;
			}
		}

		return isComplete;
	}

	// __________________________________________________________________ Stop

	stopUnstartedShapes() {
		for (let i = 0; i < this.SHAPES.length; i += 1) {
			// Stop Shapes with > 0 Delay
			if (this.SHAPES[i].getDelay() > 0) {
				this.SHAPES[i].stop();
			}
		}
	}

	// _________________________________________________________________ Destroy

	destroy() {
		// Clear Shapes
		this.SHAPES = [];
	}
}
