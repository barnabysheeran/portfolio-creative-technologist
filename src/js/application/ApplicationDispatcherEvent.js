export default class ApplicationDispatcherEvent {
	#CALLBACKS = [];

	#EVENT_NAME;

	// _________________________________________________________________________

	constructor(eventName) {
		this.#EVENT_NAME = eventName;
	}

	// ________________________________________________________________ Register

	registerCallback(callback) {
		if (typeof callback !== 'function') {
			throw new Error('Callback must be a function');
		}

		this.#CALLBACKS.push(callback);
	}

	// ______________________________________________________________ Unregister

	unregisterCallback(callback) {
		const INDEX = this.#CALLBACKS.indexOf(callback);

		if (INDEX !== -1) {
			this.#CALLBACKS.splice(INDEX, 1);
		}
	}

	// ____________________________________________________________________ Fire

	fire(data) {
		this.#CALLBACKS.forEach((callback) => {
			callback(data);
		});
	}

	// __________________________________________________________________ Access

	get EVENT_NAME() {
		return this.#EVENT_NAME;
	}
}
