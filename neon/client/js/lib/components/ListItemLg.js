import React, { Component } from 'react';

var DateManager = require('../util/DateManager');


export default class ListItemLg extends Component {
	constructor(props) {
		super(props);

		this.convertHex = this.convertHex.bind(this);
	}

	convertHex(hex) {
	    var hex = hex.replace('#','');

	    var r = parseInt(hex.substring(0,2), 16);
	    var g = parseInt(hex.substring(2,4), 16);
	    var b = parseInt(hex.substring(4,6), 16);

	    if(!b) b = 0
	    if(!g) g = 0
	    if(!r) r = 0

	    return {
	   		"background": "-webkit-linear-gradient(top, rgba("+r+","+g+","+b+",0.2) 0%,rgba("+r+","+g+","+b+",0.1) 10%,rgba("+r+","+g+","+b+",0.5) 100%), rgba("+r+","+g+","+b+",0.4)", /* Chrome10-25,Safari5.1-6 */
	   		"background": "-moz-linear-gradient(to bottom, rgba("+r+","+g+","+b+",0.2) 0%,rgba("+r+","+g+","+b+",0.1) 10%,rgba("+r+","+g+","+b+",0.5) 100%), rgba("+r+","+g+","+b+",0.4)", /* FF3.6-15 */
	   		"background": "linear-gradient(to bottom, rgba("+r+","+g+","+b+",0.2) 0%,rgba("+r+","+g+","+b+",0.1) 10%,rgba("+r+","+g+","+b+",0.5) 100%), rgba("+r+","+g+","+b+",0.4)", /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
	   	}
	}

	render() {
		var show = this.props.data;
		var venue = show.venue;

		var extra = this.props.extra;

		var website = show.website + (show.website.indexOf('?') > -1 ? '&' : '?') + 'utm_source=showgridnashville&utm_medium=web&utm_campaign=calendar';

		var boxStyle = (extra.hideHeader) ? {'display': 'none'} : {'background': venue.primary_color || '#000000'};

		var onsale = DateManager.areTicketsOnSale(show.onsale);

		var	title,
			headliner,
			opener,
			ticket,
			price,
			date,
			star,
			review,
			free,
			age;


		var backgroundImage = {
	   		"backgroundImage": "url('" + show.banner + "')"
	   	};


		if (show.star && this.props.extra.showStar) {
			star = <div className="featured"><svg className="icon icon-star" dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-star"/>' }} />&nbsp;<span>Featured Show</span></div>;
		}


		if (show.review && show.review !== "") {
			review = <article dangerouslySetInnerHTML={{__html: show.review}}></article>;
		}

		if (show.star && this.props.showStar) {
			star = <b className="rec icon-star"></b>;
		}



		// Header
		if (show.age > 0) {
			age = <div className="age">{ show.age }+</div>;
		}


		// Info --> Datetime 
		if (this.props.extra.showDate) {
			date = (
				<span className="date">{ DateManager.getFormattedShowTime(show.date) }</span>
			);
		}

		if(this.props.extra.showTime){
			date = (
				<div className="date">{ DateManager.formatShowTime(show.date) }</div>
			);		
		}



		// Info --> Artists
		// if (show.title !== '') {
		// 	title = <h4>{ show.title }</h4>;
		// }

		if (show.headliners !== '') {
			headliner = <h3>{ show.headliners }</h3>;
		}

		if (show.openers !== '') {
			opener =  <h5>{ show.openers }</h5>;
		}

		// Actions
		if (!onsale) {
			var saleDate = <span className="date">{ DateManager.formatSaleDate(show.onsale) }</span>;
			ticket = <div className="onsale">On Sale { saleDate }</div>;
		}
		else if (show.ticket !== '') {
			if(this.props.ticket_price){
				ticket = (
					<a className="ticket" href={ show.ticket } target="_blank" onClick={ this.registerTicketEvent }>
						<svg className="icon icon-ticket" dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-ticket"/>' }} />
						<span className="ticket-price"> <span className="number">${show.price}</span></span>
					</a>
				);
			} else{
				ticket = (
					<a className="ticket" href={ show.ticket } target="_blank" onClick={ this.registerTicketEvent }>
						<svg className="icon icon-ticket" dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-ticket"/>' }} />Tickets
					</a>
				);
			}
			
		}

		if (show.soldout) {
			ticket = <div className="soldout">Sold Out</div>;
		}

		if(this.props.ticket_price) price = null;


		var gradient = (extra.showGradient) ? this.convertHex(venue.primary_color) : { "background": "rgba(0,0,0,0.2)" };


		return (
			<div className="show large" style={{ 'background': venue.primary_color || '#000000' }}>
				<header style={ boxStyle }>
					<a href={ '/venue/' + venue.id }>
						<h4 style={{ cursor:'pointer' }}>{ venue.name }</h4>
					</a>
					{ date }
				</header>
				<a href={ "/show/" + show.id }>
					<div className="info" style={ gradient }>
							{ star }
							<div className="artists">
								{ headliner }
								{ opener }
							</div>
							<div className="overlay">
								<div className="bg-img" style={ backgroundImage }></div>
							</div>
						
					</div>
				</a>
				<footer>
					<div className="col-3">
						<svg className="icon icon-heart" dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-heart"/>' }} />
						<span>Favorite</span>
					</div>
					<div className="col-3">
						<svg className="icon icon-alert" dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-alert"/>' }} />
						<span>Set Alert</span>
					</div>
					<div className="col-3">
						<svg className="icon icon-share" dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-share"/>' }} />
						<span>Share</span>
					</div>
					<div className="col-3">
						{ ticket }
					</div>
				</footer>
			</div>
		);
	}
};