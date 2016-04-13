import React, { Component } from 'react';
import moment from 'moment';
import ShowActions from 'components/ShowActions';

var DateManager = require('util/DateManager.js');


export default class ListItemSm extends Component {
	render() {
		var show = this.props.data;
		var extra = this.props.extra;
		
		var	headliner,
			opener,
			onsale, actions;

		var date = (
			<div className="date">{ moment(show.date).format('M/D') }</div>
		);


		if (show.headliners !== '') {
			headliner = <h4>{ show.headliners }</h4>;
		}

		if (show.openers !== '') {
			opener =  <h5>{ show.openers }</h5>;
		}

		if (extra.onsale_info) {
			onsale = <i>Tickets On Sale: <b>{ DateManager.formatTicketSaleDate(show.onsale) }</b></i>;
		}


		return (
			<div className="show small">
				{ date }
				<div className="artists">
					<a href={ "/show/" + show.id }>
						{ headliner }
						{ opener }
						{ onsale }
					</a>
				</div>
			</div>
		);
	}
};