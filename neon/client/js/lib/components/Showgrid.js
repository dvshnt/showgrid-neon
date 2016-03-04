import React, { Component } from 'react';

import fetch from 'whatwg-fetch';

import HeaderCalendar from './HeaderCalendar';
import Calendar from './Calendar';

var GridEngine = require('../util/GridEngine');


export default class ShowGrid extends Component {
	constructor(props) {
		super(props);
		
		this.getGrid = this.getGrid.bind(this);

		GridEngine.init();

		this.state = {
			cells: GridEngine.getCellCount(),
			venues: props.venues,
			days: props.days
		};
	}

	componentDidMount() {
		var _this = this;
		var adjustGrid = function() {
			var cells = GridEngine.calculateCellCount();
			_this.setState({
				cells: cells
			});
		};

	    // Attaching grid dimension resizer on window size change
		window.addEventListener('resize', adjustGrid, true);
	}

	getGrid(date) {
		var _this = this;

		var year = date.format('YYYY');
		var month = date.format('MM');
		var day = date.format('DD');

		var url = '/api/v1/' + year + '/' + month + '/' + day + '?range=' + this.state.cells;

		window.fetch(url)
			.then(function(response) {
				return response.json();
			}).then(function(body) {
				_this.setState({
					venues: body.venues,
					days: body.days
				});
			});
	}

	render() {
		var days = this.state.days.slice(0, this.state.cells);

		return (
			<section id="calendar-inner">
				<HeaderCalendar days={ days } getGrid={ this.getGrid }/>
				<Calendar days={ days } venues={ this.state.venues } getGrid={ this.getGrid }/>
			</section>
		)
	}
};