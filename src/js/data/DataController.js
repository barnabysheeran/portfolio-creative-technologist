import DATA_JSON from './data.json';

export default class DataController {
	static #DATA = DATA_JSON;

	static #DATA_PROJECTS = DataController.#DATA.projects;

	static getProjects() {
		return DataController.#DATA_PROJECTS;
	}

	static getProjectById(projectId) {
		for (let i = 0; i < DataController.#DATA_PROJECTS.length; i += 1) {
			const project = DataController.#DATA_PROJECTS[i];
			if (project.id === projectId) {
				return project;
			}
		}
		return undefined;
	}
}
