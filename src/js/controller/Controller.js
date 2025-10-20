import ApplicationConfiguration from '../application/ApplicationConfiguration.js';
import ApplicationLogger from '../application/ApplicationLogger.js';
import ApplicationDispatcher from '../application/ApplicationDispatcher.js';

import Display from '../display/Display.js';
import GridData from '../grid/GridData.js';
import MediaSurface from '../media/MediaSurface.js';
import RenderSurface from '../render/RenderSurface.js';
import InteractiveSurface from '../interactive/InteractiveSurface.js';
import Director from '../director/Director.js';

import Development from '../development/Development.js';

export default class Controller {
	#FRAMERATE_FPS = 60;
	#FRAMERATE_MS = 1000 / this.#FRAMERATE_FPS;

	#frameRateDelayMS = 0;

	#LOG_LEVEL = 1;

	// _________________________________________________________________________

	constructor() {
		ApplicationLogger.log(
			`Controller Initialising with Frame Rate ${this.#FRAMERATE_FPS} FPS`,
			this.#LOG_LEVEL,
		);

		// Order Important
		Display.initialise();

		const DISPLAY_WIDTH = Display.getWidthPx();
		const DISPLAY_HEIGHT = Display.getHeightPx();

		GridData.initialize(DISPLAY_WIDTH, DISPLAY_HEIGHT);
		MediaSurface.initialise(DISPLAY_WIDTH, DISPLAY_HEIGHT);
		RenderSurface.initialise(DISPLAY_WIDTH, DISPLAY_HEIGHT);
		InteractiveSurface.initialise(DISPLAY_WIDTH, DISPLAY_HEIGHT);

		Director.initialise(DISPLAY_WIDTH, DISPLAY_HEIGHT);

		// Development ?
		if (ApplicationConfiguration.isDevelopment === true) {
			Development.initialise(DISPLAY_WIDTH, DISPLAY_HEIGHT);
		}

		// Application Dispatcher Events
		ApplicationDispatcher.on(
			'project-menu-open',
			this.#onProjectMenuOpen.bind(this),
		);

		ApplicationDispatcher.on(
			'project-menu-close',
			this.#onProjectMenuClose.bind(this),
		);

		ApplicationDispatcher.on(
			'view-project-menu-select',
			this.#onViewProjectMenuSelect.bind(this),
		);
	}

	// ____________________________________________________________________ Tick

	tick(frameDeltaMS) {
		// Frame Rate Delay
		this.#frameRateDelayMS += frameDeltaMS;

		// Next Frame Rate Frame ?
		if (this.#frameRateDelayMS > this.#FRAMERATE_MS) {
			// Reset
			this.#frameRateDelayMS -= this.#FRAMERATE_MS;

			// Tick at Frame Rate FPS

			// Display
			const IS_DISPLAY_UPDATED = Display.tick();

			if (IS_DISPLAY_UPDATED) {
				this.#onDisplayUpdated();
			}

			// Tick Director
			Director.tick(frameDeltaMS);
		}

		// Tick at Max Frame Rate

		// Media Surface
		MediaSurface.tick(frameDeltaMS);

		// Tick Render Surface
		RenderSurface.tick(frameDeltaMS);
	}

	// _______________________________________________________________ On Events

	#onProjectMenuOpen() {
		ApplicationLogger.log(`Controller onProjectMenuOpen`, this.#LOG_LEVEL);

		// Director
		Director.onProjectMenuOpen();

		// Media Surface
		MediaSurface.clear();
	}

	#onProjectMenuClose() {
		ApplicationLogger.log(`Controller onProjectMenuClose`, this.#LOG_LEVEL);

		// Director
		Director.onProjectMenuClose();

		// Media Surface
		MediaSurface.clear();
	}

	#onViewProjectMenuSelect(projectData) {
		ApplicationLogger.log(
			`Controller onViewProjectMenuSelect`,
			this.#LOG_LEVEL,
		);

		// Director
		Director.onViewProjectMenuSelect(projectData);

		// Media Surface
		MediaSurface.showProject(projectData);
	}

	// _________________________________________________________________ Display

	#onDisplayUpdated() {
		const DISPLAY_WIDTH = Display.getWidthPx();
		const DISPLAY_HEIGHT = Display.getHeightPx();

		ApplicationLogger.log(
			`Controller onDisplayUpdated ${DISPLAY_WIDTH} ${DISPLAY_HEIGHT}`,
			this.#LOG_LEVEL,
		);

		// Set Sizes
		GridData.setSize(DISPLAY_WIDTH, DISPLAY_HEIGHT);
		MediaSurface.setSize(DISPLAY_WIDTH, DISPLAY_HEIGHT);
		RenderSurface.setSize(DISPLAY_WIDTH, DISPLAY_HEIGHT);
		InteractiveSurface.setSize(DISPLAY_WIDTH, DISPLAY_HEIGHT);

		Director.setSize(DISPLAY_WIDTH, DISPLAY_HEIGHT);

		// Development ?
		if (ApplicationConfiguration.isDevelopment === true) {
			Development.setSize(DISPLAY_WIDTH, DISPLAY_HEIGHT);
		}
	}
}
