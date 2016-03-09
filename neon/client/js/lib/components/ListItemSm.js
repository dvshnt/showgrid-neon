import React, { Component } from 'react';
import moment from 'moment';

var DateManager = require('../util/DateManager');


export default class ListItemSm extends Component {
	render() {
		var show = this.props.data;
		
		var	headliner,
			opener;

		var date = (
			<div className="date">{ moment(show.date).format('M/D') }</div>
		);


		if (show.headliners !== '') {
			headliner = <h4>{ show.headliners }</h4>;
		}

		if (show.openers !== '') {
			opener =  <h5>{ show.openers }</h5>;
		}

		return (
			<div className="show small">
				{ date }
				<div className="artists">
					<a href={ "/show/" + show.id }>
						{ headliner }
						{ opener }
					</a>
				</div>
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
			</div>
		);
	}
};