var GridEngine = {
	cells: null,

	MIN_NUM_CELLS: 1, 	// Min number of cells in row
	MAX_NUM_CELLS: 7,	// Max number of cells in row

	V_EM_UNIT_LG: 13,		// 'em' value of venue cell
	V_EM_UNIT_SM: 13,		// 'em' value of venue cell
	S_EM_UNIT: 10.625, 	// 'em' value of show cells
	F_PX_UNIT: 16,		// 'px' value of default font

	V_WIDTH: null,	// venue cell width
	S_WIDTH: null,	// min show cell width
	
	init() {
		this.createCellWidthConstants();		// Sets cell width constants
		this.cells = this.calculateCellCount();
	},

	getCellCount() {
		return this.cells;
	},

	createCellWidthConstants() {
		var width = document.documentElement.clientWidth || window.innerWidth;

		if (width <= 320)
			this.V_WIDTH = this.V_EM_UNIT_SM * this.F_PX_UNIT;	// calc venue column min/max-width for SM
		else 
			this.V_WIDTH = this.V_EM_UNIT_LG * this.F_PX_UNIT;	// calc venue column min/max-width for LG

		this.S_WIDTH = this.S_EM_UNIT * this.F_PX_UNIT;	// calc show cell min-width
	},

	calculateCellCount() {
		var wWidth = document.documentElement.clientWidth || window.innerWidth,		// Window width
			rWidth = this.V_WIDTH,				// Base row width (constant venue width)
			count = -1;						// Count of number of cells

		while (rWidth < wWidth) {
			rWidth += this.S_WIDTH;

			count++;
		}

		count = (count < this.MIN_NUM_CELLS) ? 1 : count;
		count = (count > this.MAX_NUM_CELLS) ? 7 : count;

		this.cells = count;

		return count;
	}
};


module.exports = GridEngine;