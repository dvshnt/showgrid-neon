import React, { Component } from 'react';

import CalendarRow from './CalendarRow';


export default class Calendar extends Component {
	render() {
		var { days } = this.props;

		return (
			<section id="calendar-content">
				{
					this.props.venues.map(function(venue) {
						return <CalendarRow key={ venue.id } venue={ venue } days={ days }/>
    				})
				}
			</section>
		)
	}
}