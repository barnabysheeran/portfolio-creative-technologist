import ApplicationLogger from '../../../../application/ApplicationLogger.js';

import Shape from '../Shape.js';

import Fill from '../../enum/Fill.js';
import FillType from '../../enum/FillType.js';
import FillStrategy from '../../enum/FillStrategy.js';
import FillStrategyType from '../../enum/FillStrategyType.js';
import DrawType from '../../enum/DrawType.js';

export default class ShapeLineHorizontal extends Shape {
	#LOG_LEVEL = -1; // 6;

	// _________________________________________________________________________

	constructor(
		dotManager,
		gridX,
		gridY,
		gridLength,
		delay = 0,
		fillType = FillType.PassThrough,
		fillStrategyType = FillStrategyType.PassThrough,
		drawType = DrawType.Fill,
	) {
		super(dotManager, delay, drawType);

		ApplicationLogger.log(`ShapeLineHorizontal`, this.#LOG_LEVEL);

		// Store Initial Position Grids
		for (let i = 0; i < gridLength; i += 1) {
			this.positionGrids.push([gridX + i, gridY]);
		}

		// Fill Type
		Fill.apply(fillType, this.positionGrids, gridLength, 1);

		// Fill Strategy Type
		FillStrategy.apply(fillStrategyType, this.positionGrids);
	}
}
