import React, { Component } from 'react';

import $ from 'jquery';
import moment from 'moment';
import fetch from 'whatwg-fetch';

import DateManager from 'util/DateManager';
import * as op from 'operator';
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
			return op.renderAuthModal()
		}

		var url = '/user/rest/favorite?id='+this.props.show.id;

		$.ajax({
			url:url,
			method: this.state.favorited ? 'delete' : 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-CSRFToken': window.user.csrf
			},
		}).done(function(body) {
			_this.setState({ favorited: _this.state.favorited ? false : true });
		});
	}

	render() {
		var className = this.state.favorited ? "col-3 button-favorite button-favorite-active" : "col-3 button-favorite ";

		return (
			<div className={ className } onClick={ this.setShowAsFavorite.bind(this) } >
				<svg  dangerouslySetInnerHTML={{ __html: '<use class="svg" xlink:href="#icon-heart"/>' }} />
				<span>Favorite</span>
			</div>
		)
	}
};