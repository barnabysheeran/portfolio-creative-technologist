import ApplicationLogger from '../application/ApplicationLogger.js';

import Display from '../display/Display.js';

import DevelopmentGuides from './guide/DevelopmentGuides.js';

export default class Development {
	static #CONTAINER;

	static #DEVELOPMENT_GUIDES;

	static #LOG_LEVEL = 2;

	// _________________________________________________________________________

	static initialise(width, height) {
		ApplicationLogger.log('Development', this.#LOG_LEVEL);

		// Create Development Container on Display Container
		const DISPLAY_HOLDER = Display.getDisplayHolder();

		// Create Development Container
		this.#CONTAINER = document.createElement('div');
		this.#CONTAINER.className = 'development-surface';
		DISPLAY_HOLDER.appendChild(this.#CONTAINER);

		// Create Development Guides
		this.#DEVELOPMENT_GUIDES = new DevelopmentGuides(this.#CONTAINER);

		// Set Initial Size
		this.setSize(width, height);

		// Add Keyboard Event Listener
		window.addEventListener('keyup', this.#onKeyUp.bind(this));
	}

	// _________________________________________________________________________

	static #onKeyUp(event) {
		// 1 - Development Guides Toggle
		if (event.keyCode === 49) {
			this.#toggleGuidesShowHide();
		}
	}

	// ___________________________________________________________________ Guide

	static #toggleGuidesShowHide() {
		this.#DEVELOPMENT_GUIDES.toggleShowHide();
	}

	// ____________________________________________________________________ Size

	static setSize(width, height) {
		this.#CONTAINER.style.width = `${width}px`;
		this.#CONTAINER.style.height = `${height}px`;
	}
}
