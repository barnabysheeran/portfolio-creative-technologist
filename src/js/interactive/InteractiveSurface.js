import ApplicationLogger from '../application/ApplicationLogger.js';

import Display from '../display/Display.js';

export default class InteractiveSurface {
	static #CONTAINER;

	static #ELEMENTS = new Map();

	static #PIXEL_BORDER = 10;

	static #LOG_LEVEL = 2;

	// _________________________________________________________________________

	static initialise(width, height) {
		ApplicationLogger.log('Interactive', this.#LOG_LEVEL);

		// Create Holder
		this.#CONTAINER = document.createElement('div');
		this.#CONTAINER.classList.add('interactive-surface');

		// Append Holder to Display Holder
		Display.getDisplayHolder().appendChild(this.#CONTAINER);

		// Set Initial Size
		this.setSize(width, height);
	}

	// _______________________________________________________________ Add Block

	static createBlock(
		x,
		y,
		width,
		height,
		callbackClick,
		callbackRollOver,
		callbackRollOut,
		clickData = {},
	) {
		// Create UUID
		const uuid = crypto.randomUUID();

		// Add Pixel Border
		x -= this.#PIXEL_BORDER;
		y -= this.#PIXEL_BORDER;
		width += this.#PIXEL_BORDER * 2;
		height += this.#PIXEL_BORDER * 2;

		// Create Element
		const ELEMENT = document.createElement('div');
		ELEMENT.id = uuid;
		ELEMENT.classList.add('interactive-block');
		ELEMENT.style.left = `${x}px`;
		ELEMENT.style.top = `${y}px`;
		ELEMENT.style.width = `${width}px`;
		ELEMENT.style.height = `${height}px`;
		this.#CONTAINER.appendChild(ELEMENT);

		// Development - Add Visible Border
		// ELEMENT.style.border = `1px solid #00ff00`;

		// Set Click Data
		if (Object.keys(clickData).length > 0) {
			ELEMENT.dataset.clickData = JSON.stringify(clickData);
		}

		// Add Event Listeners
		if (callbackClick) {
			ELEMENT.addEventListener('click', (event) =>
				this.#onClick(event, callbackClick),
			);
		}

		if (callbackRollOver) {
			ELEMENT.addEventListener('mouseover', (event) =>
				this.#onRollOver(event, callbackRollOver),
			);
		}

		if (callbackRollOut) {
			ELEMENT.addEventListener('mouseout', (event) =>
				this.#onRollOut(event, callbackRollOut),
			);
		}

		// Store
		this.#ELEMENTS.set(uuid, ELEMENT);

		// Return uuid
		return uuid;
	}

	// ____________________________________________________________ Remove Block

	static removeBlock(uuid) {
		const element = this.#ELEMENTS.get(uuid);

		if (element) {
			element.remove();
			this.#ELEMENTS.delete(uuid);
		}
	}

	// __________________________________________________________ Event Handlers

	static #onClick(event, callback) {
		const clickDataString = event.currentTarget.dataset.clickData;
		const clickData = clickDataString ? JSON.parse(clickDataString) : {};
		callback(clickData);
	}

	static #onRollOver(event, callback) {
		const clickDataString = event.currentTarget.dataset.clickData;
		const clickData = clickDataString ? JSON.parse(clickDataString) : {};
		callback(clickData);
	}

	static #onRollOut(event, callback) {
		const clickDataString = event.currentTarget.dataset.clickData;
		const clickData = clickDataString ? JSON.parse(clickDataString) : {};
		callback(clickData);
	}

	// ___________________________________________________________________ Clear

	static clear() {
		ApplicationLogger.log('Interactive clear', this.#LOG_LEVEL);

		// Clear Blocks
		this.#ELEMENTS.clear();

		// Clear Holder
		this.#CONTAINER.innerHTML = '';
	}

	// ____________________________________________________________________ Size

	static setSize(width, height) {
		this.#CONTAINER.style.width = `${width}px`;
		this.#CONTAINER.style.height = `${height}px`;
	}
}
