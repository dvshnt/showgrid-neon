import React, { Component } from 'react';

import moment from 'moment';
import Pikaday from 'util/pikaday';

import HeaderCalendarDay from './HeaderCalendarDay';

var DateManager = require('util/DateManager');


export default class HeaderCalendar extends Component {
	constructor(props) {
		super(props);
		
		this.goToToday = this.goToToday.bind(this);
	}

	componentDidMount() {
		var _this = this;

		var picker = new Pikaday({
        	field: document.getElementById('datepicker'),
	        format: 'D MMM YYYY',
	        minDate: moment().toDate(),
	        onSelect: function() {
	        	var day = this.getMoment();
	        	_this.props.getGrid(day);
	        }
	    });
	}

	goToToday(e) {
		this.props.getGrid(moment());
	}

	render() {
		var headDays = [];

		var { days } = this.props;

		var startDate = (days.length === 0) ? moment() : moment(days[0], 'YYYY-MM-DD');

		var backToToday = (!startDate.isSame(new Date(), 'day')) ? 'visible' : '';


		if (this.props.days.length > 1) {
			var month = startDate.format('MMMM');
			var monthClass = "month";

			for (var i=0; i < this.props.days.length; i++) {
				headDays.push( <HeaderCalendarDay key={ i } day={ days[i] }/> );
			}
		}
		else {
			var month = DateManager.getMobileDate(startDate);
			var monthClass = "month wide";
		}

		return (
			<header id="header_calendar">
				<div id="datepicker" className={ monthClass }><span>{ month }</span></div>
				{ headDays }
				<div id="back-to-today" className={ backToToday } onClick={ this.goToToday }><div></div>Back to Today</div>
			</header>
		)
	}
};