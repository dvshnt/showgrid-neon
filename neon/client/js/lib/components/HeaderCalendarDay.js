import React, { Component } from 'react';

var DateManager = require('../util/DateManager');

export default class HeaderCalendarDay extends Component {
	render() {
		var date = DateManager.formatHeaderCalendarDay(this.props.day);

		return (
			<div className="day">
				<span>{ date }</span>
			</div>
		)
	}
};