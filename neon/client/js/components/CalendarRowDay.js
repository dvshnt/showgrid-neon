import React, { Component } from 'react';
	
import CalendarRowDayShow from './CalendarRowDayShow';

var DateManager = require('util/DateManager');


export default class CalendarRowDay extends Component {
	render() {
		var shows = DateManager.getShowsOnDate(this.props.day, this.props.shows);

		return (
			<div className="day">
				{
					shows.map(function(show) {
						return <CalendarRowDayShow key={ show.id } show={ show }/>
					})
				}
			</div>
		)
	}
};