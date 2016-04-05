import React, { Component } from 'react';

import CalendarRowVenue from './CalendarRowVenue';
import CalendarRowDay from './CalendarRowDay';

export default class CalendarRow extends Component {
	render() {
		var shows = [];

		var { days, venue } = this.props;

		var rowClass = (venue.shows.length > 0) ? "calendar__row" : "calendar__row mini";


		for (var i=0; i < days.length; i++) {
			shows.push( <CalendarRowDay key={ i } day={ days[i] } shows={ venue.shows }/> );
		}


		return (
			<div className={ rowClass }>				
				<CalendarRowVenue venue={ venue } />
				{ shows }
			</div>
		)
	}
};