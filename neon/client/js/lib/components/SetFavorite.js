import React, { Component } from 'react';
import $ from 'jquery';
import '../util/csrf'

var DateManager = require('../util/DateManager');
var GridEngine = require('../util/GridEngine');


class SetFavorite extends Component {	
	constructor(props) {
		super(props);

		var match = window.user.favorites.filter(function(fav){
			return fav.show_id == this.props.show.id
		}.bind(this))
		
		this.state = {
			favorited: match.length
		};
	}

	setShowAsFavorite(e) {
		$.ajax({
			type : this.state.favorited ? 'delete' : 'post',
			url  : '/user/rest/favorite',
			data: JSON.stringify({'show':this.props.show.id}),
			error: function(e){
				this.setState({
					favorited: this.state.favorited ? false : true
				});	
				throw e
			}.bind(this),
			success: function(e){
				console.log("SET FAVORITE",e)
			}
		})
		this.setState({
			favorited: !this.state.favorited
		})
	}

	render() {
		return (
			<div className="col-3" onClick={ this.setShowAsFavorite.bind(this) } >
				<svg className={this.state.favorited ? "icon icon-heart active" : "icon icon-heart"} dangerouslySetInnerHTML={{ __html: '<use class="svg" xlink:href="#icon-heart"/>' }} />
			</div>
		)
	}
};

export default SetFavorite

