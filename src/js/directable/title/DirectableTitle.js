import ApplicationLogger from '../../application/ApplicationLogger.js';

export default class DirectableTitle {
	// _________________________________________________________________________

	constructor() {
		ApplicationLogger.log('DirectableTitle', this.LOG_LEVEL);
	}

	// ________________________________________________________________ Set Text

	setText(text) {
		document.title = text;
	}
}
