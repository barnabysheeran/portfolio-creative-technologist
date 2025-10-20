import FillType from './FillType.js';

export default class Fill {
	static apply(fillType, positionGrids) {
		switch (fillType) {
			case FillType.PassThrough:
				// Do Nothing
				break;
			case FillType.Random:
				// Randomize
				this.#applyRandom(positionGrids);
				break;
		}
	}

	// __________________________________________________________________ Random

	static #RANDOM_CHANCE = 0.5;

	static #applyRandom(positionGrids) {
		const itemsToRemove = [];

		// Remove Randomly
		for (const positionGrid of positionGrids) {
			if (Math.random() < this.#RANDOM_CHANCE) {
				itemsToRemove.push(positionGrid);
			}
		}

		// Remove items from positionGrids
		for (const item of itemsToRemove) {
			const index = positionGrids.indexOf(item);
			if (index > -1) {
				positionGrids.splice(index, 1);
			}
		}
	}
}
