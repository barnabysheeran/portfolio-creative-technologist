import ApplicationLogger from '../../../application/ApplicationLogger.js';

export default class ComponentManager {
	#COMPONENTS = [];

	#LOG_LEVEL = 4;

	// _________________________________________________________________________

	constructor() {}

	// ____________________________________________________________________ Tick

	tick() {
		// Tick Components
		for (let i = 0; i < this.#COMPONENTS.length; i += 1) {
			const IS_COMPLETE = this.#COMPONENTS[i].tick();

			if (IS_COMPLETE) {
				// Remove Component
				this.#COMPONENTS.splice(i, 1);
				i -= 1; // Adjust index after removal
			}
		}
	}

	// ___________________________________________________________ Add Component

	addComponent(component) {
		// Store Component
		this.#COMPONENTS.push(component);
	}

	// ___________________________________________________________________ Reset

	reset() {
		ApplicationLogger.log('ComponentManager reset', this.#LOG_LEVEL);

		// Clear Components Array
		this.#COMPONENTS = [];
	}

	stopUnstartedShapes() {
		// Remove Components with > 0 Delay
		for (let i = 0; i < this.#COMPONENTS.length; i += 1) {
			this.#COMPONENTS[i].stopUnstartedShapes();
		}
	}

	// __________________________________________________________________ Access

	getActiveComponentTotal() {
		// Return Active Component Total
		return this.#COMPONENTS.length;
	}
}
