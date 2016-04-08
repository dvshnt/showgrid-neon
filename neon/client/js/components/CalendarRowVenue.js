import React, { Component } from 'react';

var GridEngine = require('util/GridEngine');


export default class CalendarRowVenue extends Component {
	constructor(props) {
		super(props);

		this.gradient = this.gradient.bind(this);
	}

	gradient(){

		if(!this.props.venue.primary_color){
			var r = 0,
				g = 0,
				b = 0;
		} 
		else{
			var hex = this.props.venue.primary_color.replace('#','');
			var r = parseInt(hex.substring(0,2), 16);
	  	  	var g = parseInt(hex.substring(2,4), 16);
	    	var b = parseInt(hex.substring(4,6), 16);
		}

		if(!b) b = 0;
		if(!g) g = 0;
		if(!r) r = 0;

		return {
			// background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%,rgba(0,0,0,0) 5%,rgba("+r+","+g+","+b+",1) 50%,rgba("+r+","+g+","+b+",1) 100%), rgba("+r+","+g+","+b+",0.3)"
			background: "-moz-linear-gradient(top, rgba("+r+","+g+","+b+",1) 0%, rgba("+r+","+g+","+b+",0.9) 6%, rgba("+r+","+g+","+b+",0.1) 42%, rgba("+r+","+g+","+b+",0.1) 60%, rgba("+r+","+g+","+b+",1) 100%)", /* FF3.6-15 */
			background: "-webkit-linear-gradient(top, rgba("+r+","+g+","+b+",1) 0%,rgba("+r+","+g+","+b+",0.9) 6%,rgba("+r+","+g+","+b+",0.1) 42%,rgba("+r+","+g+","+b+",0.1) 60%,rgba("+r+","+g+","+b+",1) 100%)", /* Chrome10-25,Safari5.1-6 */
			background: "linear-gradient(to bottom, rgba("+r+","+g+","+b+",1) 0%,rgba("+r+","+g+","+b+",0.9) 6%,rgba("+r+","+g+","+b+",0.1) 42%,rgba("+r+","+g+","+b+",0.1) 60%,rgba("+r+","+g+","+b+",1) 100%)", /* W3C, IE10+, FF16+, Chrome26+, Opera12+, Safari7+ */
		}	
	}

	render() {
		this.props.venue.website += '?utm_source=showgridnashville&utm_medium=web&utm_campaign=calendar';

		var primaryColor = {
			'background': this.props.venue.primary_color
		};

		var titleColor = {
			'color': this.props.venue.secondary_color
		};

		var image = {
			'background-image': 'url(' + this.props.venue.image + ')',
			'filter': 'grayscale(1)',
			'-webkit-filter':'grayscale(1)'
		};

		
		var link = '/venue/'+this.props.venue.id;

		return (
			<a href={ link } className="venue" style={ primaryColor }>
				<div className="image" style={ image }></div>
				<div className="overlay" style={ this.gradient() }>
					
					<h3 className="name" style={ titleColor }>{ this.props.venue.name }</h3>

					<div  className="address">
				    	<div>
			    			{ this.props.venue.address.street }
				    	</div>
				    	<div>
				    		{ this.props.venue.address.city },  { this.props.venue.address.state } { this.props.venue.address.zip_code }
				    	</div>
			    	</div>
		    	</div>
			</a>
		)
	}
};

