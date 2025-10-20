import ApplicationLogger from '../../application/ApplicationLogger.js';
import ApplicationConfiguration from '../../application/ApplicationConfiguration.js';

import MediaSurfaceImage from './MediaSurfaceImage.js';

export default class MediaSurfaceImageGallery {
	#HOLDER;

	#IMAGES = [];
	#imagesToLoad = 0;

	#indexImageCurrent = 0;

	#DELAY_NEXT_IMAGE_MAX = 60 * 4; // Frames
	#delayNextImage = -1;

	#DELAY_RESTART_AUTO = 60 * 4; // Frames
	#delayRestartAuto = -1;

	#isStopping = false;

	#LOG_LEVEL = 4;

	// _________________________________________________________________________

	constructor(container, imageUrls) {
		ApplicationLogger.log(`MediaSurfaceImageGallery`, this.#LOG_LEVEL);

		// Create Holder
		this.#HOLDER = document.createElement('div');
		this.#HOLDER.className = 'image-gallery';
		container.appendChild(this.#HOLDER);

		// Event Listeners
		this.#HOLDER.addEventListener('mousedown', this.#onMouseDown.bind(this));
		this.#HOLDER.addEventListener('touchstart', this.#onMouseDown.bind(this));

		// Store Images
		const ASSET_PATH = ApplicationConfiguration.getAssetPath();

		for (let i = 0; i < imageUrls.length; i++) {
			// Create
			const MEDIA_SURFACE_IMAGE = new MediaSurfaceImage(
				this.#HOLDER,
				ASSET_PATH + imageUrls[i],
				this.#onImageLoaded.bind(this),
			);

			// Store
			this.#IMAGES.push(MEDIA_SURFACE_IMAGE);
		}

		// Images to Load
		this.#imagesToLoad = this.#IMAGES.length;
	}

	// _____________________________________________________________ Interaction

	#onMouseDown(event) {
		ApplicationLogger.log(
			`MediaSurfaceImageGallery #onMouseDown`,
			this.#LOG_LEVEL,
		);

		// Prevent a Tap firing both mouse and touch events
		event.preventDefault();

		// Stopping ?
		if (this.#isStopping) {
			return;
		}

		// End Delay Next Image
		this.#delayNextImage = -1;

		// Start Delay Restart Auto
		this.#delayRestartAuto = this.#DELAY_RESTART_AUTO;

		// Set All Lerps to Fast
		for (let i = 0; i < this.#IMAGES.length; i++) {
			this.#IMAGES[i].setLerpFast();
		}

		// Show Next Image
		this.#showNextImage();
	}

	// ____________________________________________________________________ Tick

	tick() {
		// Delay Next Image ?
		if (this.#delayNextImage > 0) {
			// Decrement Delay
			this.#delayNextImage -= 1;

			if (this.#delayNextImage === 0) {
				this.#showNextImage();

				// Reset Delay
				this.#delayNextImage = this.#DELAY_NEXT_IMAGE_MAX;
			}
		}

		// Delay Restart Auto ?
		if (this.#delayRestartAuto > 0) {
			// Decrement Delay
			this.#delayRestartAuto -= 1;

			if (this.#delayRestartAuto === 0) {
				// Set Lerps to Slow
				for (let i = 0; i < this.#IMAGES.length; i++) {
					this.#IMAGES[i].setLerpSlow();
				}

				// Restart Auto
				this.#showNextImage();
			}
		}

		// Tick Images
		let isComplete = true;

		for (let i = 0; i < this.#IMAGES.length; i++) {
			const IS_IMAGE_COMPLETE = this.#IMAGES[i].tick();

			if (IS_IMAGE_COMPLETE === false) {
				isComplete = false;
			}
		}

		if (this.#isStopping && isComplete === true) {
			ApplicationLogger.log(
				`MediaSurfaceImageGallery - All images stopped`,
				this.#LOG_LEVEL,
			);

			return true;
		}

		// Return Not Complete
		return false;
	}

	// _________________________________________________________________ Loading

	#onImageLoaded() {
		ApplicationLogger.log(
			`MediaSurfaceImageGallery #onImageLoaded ${this.#imagesToLoad}`,
			this.#LOG_LEVEL,
		);

		// Decrement Images to Load
		this.#imagesToLoad -= 1;

		// All Images Loaded ?
		if (this.#imagesToLoad === 0) {
			this.#onAllImagesLoaded();
		}
	}

	#onAllImagesLoaded() {
		// Start Showing Images
		ApplicationLogger.log(
			`MediaSurfaceImageGallery #onAllImagesLoaded`,
			this.#LOG_LEVEL,
		);

		// Show First Image
		this.#indexImageCurrent = 0;
		this.#IMAGES[this.#indexImageCurrent].show();

		// Start Delay
		this.#delayNextImage = this.#DELAY_NEXT_IMAGE_MAX;
	}

	#showNextImage() {
		// Hide Current Image
		this.#IMAGES[this.#indexImageCurrent].hide();

		// Increment Index
		this.#indexImageCurrent += 1;

		// Wrap Around
		if (this.#indexImageCurrent >= this.#IMAGES.length) {
			this.#indexImageCurrent = 0;
		}

		// Show Next Image
		this.#bringImageToFront(this.#indexImageCurrent);
		this.#IMAGES[this.#indexImageCurrent].show();
	}

	#bringImageToFront(indexImage) {
		// Bring Image to Front
		const HOLDER = this.#IMAGES[indexImage].getHolder();

		HOLDER.parentNode.appendChild(HOLDER);
	}

	// ____________________________________________________________________ Stop

	stop() {
		// End Delay Next Image
		this.#delayNextImage = -1;

		// End Delay Restart Auto
		this.#delayRestartAuto = -1;

		// Set Lerps to Slow
		for (let i = 0; i < this.#IMAGES.length; i++) {
			this.#IMAGES[i].setLerpSlow();
		}

		// Stop All Images
		for (let i = 0; i < this.#IMAGES.length; i++) {
			this.#IMAGES[i].stop();
		}

		// Is Stopping
		this.#isStopping = true;
	}

	// ____________________________________________________________________ Size

	setSize(widthPx, heightPx) {
		ApplicationLogger.log(
			`MediaSurfaceImageGallery setSize ${widthPx}, ${heightPx}`,
			this.#LOG_LEVEL,
		);
	}

	// _________________________________________________________________ Destroy

	destroy() {
		ApplicationLogger.log('MediaSurfaceImageGallery destroy', this.#LOG_LEVEL);

		// Images
		for (let i = 0; i < this.#IMAGES.length; i++) {
			this.#IMAGES[i].destroy();
		}

		// Remove Holder
		if (this.#HOLDER) {
			this.#HOLDER.remove();
			this.#HOLDER = null;
		}
	}
}
