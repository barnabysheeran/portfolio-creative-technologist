// Import CSS
import '../css/index.css';

// Application
import Application from './application/Application.js';

export function create(creationParameters) {
	return new Application(creationParameters);
}
