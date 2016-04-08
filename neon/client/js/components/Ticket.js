import React, { Component } from 'react';

import DateManager from 'util/DateManager';


export default class Ticket extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		var show = this.props.show;

		var onsale = DateManager.areTicketsOnSale(show.onsale);
		var ticket = "";

		if (!onsale) {
			var saleDate = 
			ticket = (
				<div className="onsale">
					On Sale 
					<span className="date">
						{ DateManager.formatSaleDate(show.onsale) }
					</span>
				</div>
			)
		} else if (show.ticket !== '') {
			ticket = (
				<a className="ticket" href={ show.ticket } target="_blank">
					<svg className="icon icon-ticket" dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-ticket"/>' }} />
				 	<span className="ticket-price"><span className="number">${ show.price }</span></span>
				</a>
			);
		}

		if (show.soldout) {
			ticket = <div className="soldout">Sold Out</div>;
		}

		return (
			<div className="col-3 ticket">
				{ ticket }
			</div>
		)
	}
};