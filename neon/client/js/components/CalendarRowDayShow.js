import React, { Component } from 'react';

var DateManager = require('util/DateManager');


export default class CalendarRowDayShow extends Component {	
	render() {
		var show = this.props.show;

		var time = DateManager.formatShowTime(show.date);
		var headliner = <div className="main">{ show.headliners }</div>;

		var opener = "";
		if (show.openers !== '') {
			opener =  <div className="extra">{ show.openers }</div>;
		}
		
		var url = "/show/" + show.id;


		return (
			<a className="show" href={ url }>
				<div className="info">
	            	<span className="time">{ time }</span>
				</div>
				<div className="titles">
					{ headliner }
					{ opener }
				</div>
	        </a>
		)
	}
};
