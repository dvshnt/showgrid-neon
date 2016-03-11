import React, { Component } from 'react';
import $ from 'jquery';

import fetch from 'whatwg-fetch';

import Showgrid from './components/Showgrid';

import List from './components/List';
import ListItemLg from './components/ListItemLg';
import ListItemSm from './components/ListItemSm';
import AuthModal from './components/AuthModal';
import UserProfile from './components/Profile';
import {ShowActions} from './components/ShowActions';

var calendar = document.getElementById("calendar");
if (!!calendar) {
	console.log("START - Calendar Render");
	React.render(<Showgrid days={ days } venues={ venues } />, calendar);
	console.log("END - Calendar Render");
}


var featured = document.getElementById("featured-shows");
if (!!featured) {
	var extra = {
		date_heading: true,
		showDate: true,
		showStar: true,
		showGradient: true
	};

	console.log("START - Featured Render");
	React.render(<List items={ shows } itemType={ ListItemLg } extra={ extra }/>, featured);
	console.log("END - Featured Render");
}


var frontFeatured = document.getElementById("front-featured");
if (!!frontFeatured) {
	var extra = {
		date_heading_front: true,
		showDate: true,
		showStar: true,
		showGradient: true
	};

	console.log("START - Featured Front Render");
	React.render(<List items={ featuredShows } itemType={ ListItemLg } extra={ extra }/>, frontFeatured);
	console.log("END - Featured Front Render");
}


var search = document.getElementById("search-results");
if (!!search) {
	var extra = {
		showStar: true,
		showDate: true,
		showGradient: true
	};

	console.log("START - Search Results Render");
	React.render(<List items={ shows } itemType={ ListItemLg } extra={ extra }/>, search);
	console.log("END - Search Results Render");
}


var venueShows = document.getElementById("venue-shows");
if (!!venueShows) {
	var url = '/api/v1/shows?orderby=date&venue=' + venue.id;

	window.fetch(url)
	.then(function(response) {
		return response.json();
	}).then(function(body) {
		var extra = {
			hideHeader: true,
			date_heading: true
		};
		console.log("START - Venue Shows Render");
		React.render(<List items={ body } itemType={ ListItemLg } extra={ extra }/>, venueShows);
		console.log("END - Venue Shows Render");
	});
}

var venueRecent = document.getElementById("venue-recent");
if (!!venueRecent) {
	var url = '/api/v1/shows?orderby=created_at&limit=5&venue=' + venue.id;

	window.fetch(url)
		.then(function(response){
			return response.json();
		}).then(function(body){
			var extra = {
				header_recent: true
			};

			console.log("START - Venue Recent Render");
			React.render(<List items={ body } itemType={ ListItemSm } extra={ extra } />, venueRecent);
			console.log("END - Venue Recent Render");

		});
}

var userProfile = document.getElementById('profile')
if(!!userProfile){
	React.render(<UserProfile tab = 'alert' profile={window.user} />,userProfile);
}




var frontOnsale = document.getElementById("front-onsale");
if (!!frontOnsale) {
	var url = '/api/v1/shows?orderby=onsale&limit=5&onsale=true';

	window.fetch(url)
		.then(function(response) {
			return response.json();
		}).then(function(body) {
			var extra = {
				header_onsale: true,
				onsale_info: true
			};

			console.log("START - Venue Recent Render");
			React.render(<List items={ body } itemType={ ListItemSm } extra={ extra } />, frontOnsale);
			console.log("END - Venue Recent Render");

		});
}


var frontRecent = document.getElementById("front-recent");
if (!!frontRecent) {
	var url = '/api/v1/shows?orderby=created_at&limit=5';

	window.fetch(url).then(function(response) {
		return response.json();
	}).then(function(body) {
		var extra = {
			header_recent: true
		};

		console.log("START - Venue Recent Render");
		React.render(<List items={ body } itemType={ ListItemSm } extra={ extra } />, frontRecent);
		console.log("END - Venue Recent Render");
	});
}



var showActions = document.getElementById('show-actions') || document.getElementById('show-actions-wide')
console.log(showActions)
if (!!showActions) {
	React.render(<ShowActions show={window.show} />,document.getElementById('show-actions'));
	React.render(<ShowActions show={window.show} />,document.getElementById('show-actions-wide'));
}




$("#search-toggle").click(function(e) {
	var searchBar = $("#subhead");

	// if (!!calendar) searchBar.addClass("calendar");

	if (searchBar.hasClass("active")) {
		searchBar.removeClass("active");
		return;
	}
	searchBar.addClass("active");
});






/* AUTHENTICATION */
var profileButton = $("#profile-button");
if(!window.user.is_authenticated){
	profileButton.on('click',function(e){
		React.render(<AuthModal visible={true} />,document.getElementById('overlay-wrapper'))
	})
}else{
	profileButton.on('click',function(e){
		window.location.href = '/user/profile'
	})
}




