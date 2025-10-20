import ApplicationLogger from '../../../../application/ApplicationLogger.js';

import Shape from '../Shape.js';

import Fill from '../../enum/Fill.js';
import FillType from '../../enum/FillType.js';
import FillStrategy from '../../enum/FillStrategy.js';
import FillStrategyType from '../../enum/FillStrategyType.js';
import DrawType from '../../enum/DrawType.js';

export default class ShapeRectangle extends Shape {
	#LOG_LEVEL = -1; // 6;

	// _________________________________________________________________________

	constructor(
		dotManager,
		gridX,
		gridY,
		gridWidth,
		gridHeight,
		delay = 0,
		fillType = FillType.PassThrough,
		fillStrategyType = FillStrategyType.PassThrough,
		drawType = DrawType.Fill,
	) {
		super(dotManager, delay, drawType);

		ApplicationLogger.log(`ShapeRectangle`, this.#LOG_LEVEL);

		// Store Initial Position Grids
		for (let w = 0; w < gridWidth; w++) {
			for (let h = 0; h < gridHeight; h++) {
				this.positionGrids.push([gridX + w, gridY + h]);
			}
		}

		// Fill Type
		Fill.apply(fillType, this.positionGrids, gridWidth, gridHeight);

		// Fill Strategy Type
		FillStrategy.apply(fillStrategyType, this.positionGrids);
	}
}
