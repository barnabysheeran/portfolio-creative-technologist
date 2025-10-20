import { vec2 } from 'gl-matrix';

import ApplicationLogger from '../application/ApplicationLogger.js';

export default class GridData {
	static #gridCellWidthPx = 3;
	static #gridCellHeightPx = 3;

	static #resolutionWidth = 0;
	static #resolutionHeight = 0;

	// Flat data structure for grid cells
	static #grid = [];
	static #occupied = new Uint8Array();
	static #gridWidthInCells = 0;
	static #gridHeightInCells = 0;

	static #LOG_LEVEL = 2;

	// ______________________________________________________________ Initialize

	static initialize(width, height) {
		ApplicationLogger.log('GridData', this.#LOG_LEVEL);

		// Set Initial Size
		this.setSize(width, height);
	}

	// ____________________________________________________________________ Grid

	static getGridPixelPositionX(gridX) {
		return gridX * this.#gridCellWidthPx;
	}

	static getGridPixelPositionY(gridY) {
		return gridY * this.#gridCellHeightPx;
	}

	static #getIndex(x, y) {
		return y * this.#gridWidthInCells + x;
	}

	static setGridCell(x, y, data) {
		const intX = Math.floor(x);
		const intY = Math.floor(y);
		if (
			intX >= 0 &&
			intX < this.#gridWidthInCells &&
			intY >= 0 &&
			intY < this.#gridHeightInCells
		) {
			const index = this.#getIndex(intX, intY);
			this.#grid[index] = data;
		}
	}

	static getGridCell(x, y) {
		const intX = Math.floor(x);
		const intY = Math.floor(y);
		if (
			intX >= 0 &&
			intX < this.#gridWidthInCells &&
			intY >= 0 &&
			intY < this.#gridHeightInCells
		) {
			const index = this.#getIndex(intX, intY);
			return this.#grid[index];
		}
		return undefined;
	}

	// __________________________________________________________________ Random

	static getRandomGridCell() {
		const x = Math.floor(Math.random() * this.#gridWidthInCells);
		const y = Math.floor(Math.random() * this.#gridHeightInCells);

		return vec2.fromValues(x, y);
	}

	static getRandomEmptyGridCell() {
		const randomIndexes = this.#generateRandomOrderCellIndexes();

		for (const index of randomIndexes) {
			if (this.#occupied[index] === 0) {
				const x = index % this.#gridWidthInCells;
				const y = Math.floor(index / this.#gridWidthInCells);
				return vec2.fromValues(x, y);
			}
		}

		return undefined;
	}

	static getRandomEmptyRectangle(rectangleWidthCells, rectangleHeightCells) {
		const randomIndexes = this.#generateRandomOrderCellIndexes();

		for (const index of randomIndexes) {
			if (
				this.isRectangleEmpty(index, rectangleWidthCells, rectangleHeightCells)
			) {
				const x = index % this.#gridWidthInCells;
				const y = Math.floor(index / this.#gridWidthInCells);
				return vec2.fromValues(x, y);
			}
		}

		return undefined;
	}

	// ____________________________________________________________________ Util

	static #generateRandomOrderCellIndexes() {
		const totalCells = this.#gridWidthInCells * this.#gridHeightInCells;
		const indexes = Array.from({ length: totalCells }, (_, i) => i);

		// Fisher-Yates shuffle
		for (let i = indexes.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[indexes[i], indexes[j]] = [indexes[j], indexes[i]];
		}

		return indexes;
	}

	// ________________________________________________________________ Occupied

	static setCellOccupied(x, y, isOccupied) {
		const intX = Math.floor(x);
		const intY = Math.floor(y);
		if (
			intX >= 0 &&
			intX < this.#gridWidthInCells &&
			intY >= 0 &&
			intY < this.#gridHeightInCells
		) {
			const index = this.#getIndex(intX, intY);
			this.#occupied[index] = isOccupied ? 1 : 0;
		}
	}

	static isCellOccupied(x, y) {
		const intX = Math.floor(x);
		const intY = Math.floor(y);
		if (
			intX >= 0 &&
			intX < this.#gridWidthInCells &&
			intY >= 0 &&
			intY < this.#gridHeightInCells
		) {
			const index = this.#getIndex(intX, intY);
			return this.#occupied[index] === 1;
		}
		return false; // Default to not occupied if out of bounds
	}

	static isRectangleEmpty(gridCellIndex, gridWidth, gridHeight) {
		const startX = gridCellIndex % this.#gridWidthInCells;
		const startY = Math.floor(gridCellIndex / this.#gridWidthInCells);

		// Check if the rectangle fits within the grid boundaries
		if (startX + gridWidth > this.#gridWidthInCells) {
			return false;
		}
		if (startY + gridHeight > this.#gridHeightInCells) {
			return false;
		}

		// Check if all cells in the rectangle are empty
		for (let y = 0; y < gridHeight; y++) {
			for (let x = 0; x < gridWidth; x++) {
				if (this.isOccupied(startX + x, startY + y)) {
					return false;
				}
			}
		}

		return true;
	}

	// __________________________________________________ Access Grid Cell Width

	static getGridCellWidthPx() {
		return this.#gridCellWidthPx;
	}

	static getGridCellHeightPx() {
		return this.#gridCellHeightPx;
	}

	// ________________________________________________________________ Grid Max

	static getGridWidthInCells() {
		return this.#gridWidthInCells;
	}

	static getGridHeightInCells() {
		return this.#gridHeightInCells;
	}

	// __________________________________________________________________ Mobile

	static #GRID_WIDTH_MOBILE = 130;

	static getIsMobile() {
		return this.#gridWidthInCells < this.#GRID_WIDTH_MOBILE;
	}

	// ____________________________________________________________________ Size

	static setSize(width, height) {
		// Store
		this.#resolutionWidth = width;
		this.#resolutionHeight = height;

		// Update grid dimensions
		this.#gridWidthInCells = Math.floor(
			this.#resolutionWidth / this.#gridCellWidthPx,
		);

		this.#gridHeightInCells = Math.floor(
			this.#resolutionHeight / this.#gridCellHeightPx,
		);

		ApplicationLogger.log(
			`GridData setSize ${width} ${height} px. grid ${this.#gridWidthInCells} ${this.#gridHeightInCells}`,
			this.#LOG_LEVEL,
		);

		// Re-initialize the flat array
		const size = this.#gridWidthInCells * this.#gridHeightInCells;
		this.#grid = new Array(size).fill(null);
		this.#occupied = new Uint8Array(size); // Automatically filled with 0
	}
}
