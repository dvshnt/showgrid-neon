import React, { Component } from 'react';

import $ from 'jquery';
import moment from 'moment';
import fetch from 'whatwg-fetch';

import DateManager from '../util/DateManager';

import AuthModal from './AuthModal';


export default class SetFavorite extends Component {	
	constructor(props) {
		super(props);
		
		if (window.user.is_authenticated == true) {
			var match = window.user.favorites.filter(function(fav) {
				return fav.id == this.props.show.id
			}.bind(this));
		}
		else{
			var match = [];	
		}
		
		this.state = {
			favorited: match.length
		};
	}

	setShowAsFavorite(e) {
		var _this = this;

		if (window.user.is_authenticated == false) {
			return React.render(React.render(<AuthModal visible={true} />,document.getElementById('overlay-wrapper')));
		}

		var url = '/user/rest/favorite';

		window.fetch(url, {
				method: this.state.favorited ? 'delete' : 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'X-CSRFToken': $("input[name=csrfmiddlewaretoken]").val()
				},
				body: JSON.stringify({
					show: _this.props.show.id
				})
			})
			.then(function(response) {
				return response.json();
			})
			.then(function(body) {
				_this.setState({
					favorited: _this.state.favorited ? false : true
				});
			});
	}

	render() {
		var className = this.state.favorited ? "col-3 favorite active" : "col-3 favorite";

		return (
			<div className={ className } onClick={ this.setShowAsFavorite.bind(this) } >
				<svg className="icon icon-heart" dangerouslySetInnerHTML={{ __html: '<use class="svg" xlink:href="#icon-heart"/>' }} />
				<span>Favorite</span>
			</div>
		)
	}
};