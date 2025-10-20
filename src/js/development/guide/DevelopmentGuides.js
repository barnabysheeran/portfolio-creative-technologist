export default class DevelopmentGuides {
	#HOLDER;

	#GUIDE_HORIZONTAL_HALF;

	#GUIDE_VERTICAL_HALF;

	#HOLDER_CSS = ``;

	#GUIDE_HORIZONTAL_CSS = `
		position: absolute;

		left: 0;

		width: 100%;
		height: 1px;

		background-color: #fff;

		opacity: 0.5;
	`;

	#GUIDE_VERTICAL_CSS = `
		position: absolute;

		top: 0;

		width: 1px;
		height: 100%;
		background-color: #fff;

		opacity: 0.5;
	`;

	#isHidden = false;

	// _________________________________________________________________________

	constructor(container) {
		// Create Guide Holder
		this.#HOLDER = document.createElement('div');
		this.#HOLDER.id = 'development-guides';
		this.#HOLDER.style.cssText = this.#HOLDER_CSS;
		container.appendChild(this.#HOLDER);

		// __________________________________________________________ Horizontal

		this.#GUIDE_HORIZONTAL_HALF = document.createElement('div');
		this.#GUIDE_HORIZONTAL_HALF.style.cssText = this.#GUIDE_HORIZONTAL_CSS;
		this.#GUIDE_HORIZONTAL_HALF.style.top = '50%';
		this.#HOLDER.appendChild(this.#GUIDE_HORIZONTAL_HALF);

		// ____________________________________________________________ Vertical

		this.#GUIDE_VERTICAL_HALF = document.createElement('div');
		this.#GUIDE_VERTICAL_HALF.style.cssText = this.#GUIDE_VERTICAL_CSS;
		this.#GUIDE_VERTICAL_HALF.style.left = '50%';
		this.#HOLDER.appendChild(this.#GUIDE_VERTICAL_HALF);

		// ________________________________________________________ Start Hidden

		this.#hide();
	}

	// _______________________________________________________________ Show Hide

	toggleShowHide() {
		if (this.#isHidden) {
			this.#show();
		} else {
			this.#hide();
		}
	}

	#show() {
		// Show Guide Holder
		this.#HOLDER.style.display = 'initial';

		// Store
		this.#isHidden = false;
	}

	#hide() {
		// Hide Guide Holder
		this.#HOLDER.style.display = 'none';

		// Store
		this.#isHidden = true;
	}
}
