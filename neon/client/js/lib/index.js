import React, { Component } from 'react';
import $ from 'jQuery';

import fetch from 'whatwg-fetch';

import Showgrid from './components/Showgrid';

import List from './components/List';
import ListItemLg from './components/ListItemLg';
import ListItemSm from './components/ListItemSm';
import AuthModal from './components/AuthModal';
import UserProfile from './components/Profile';


var calendar = document.getElementById("calendar");
if (!!calendar) {
	console.log("START - Calendar Render");
	React.render(<Showgrid days={ days } venues={ venues } />, calendar);
	console.log("END - Calendar Render");
}


var featured = document.getElementById("featured");
if (!!featured) {
	var extra = {
		date_heading: true,
		showStar: true
	};

	console.log("START - Featured Render");
	React.render(<List items={ shows } itemType={ ListItemLg } extra={ extra }/>, featured);
	console.log("END - Featured Render");
}


var search = document.getElementById("search-results");
if (!!search) {
	var extra = {
		showStar: true,
		showDate: true
	};

	console.log("START - Search Results Render");
	React.render(<List items={ shows } itemType={ ListItemLg } extra={ extra }/>, search);
	console.log("END - Search Results Render");
}


var venueShows = document.getElementById("venue-shows");
if (!!venueShows) {
	var url = '/api/v1/shows?orderby=date&venue=' + venue.id;

	window.fetch(url)
	.then(function(response){
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
	var url = '/api/v1/shows?orderby=created_at&limit=10&venue=' + venue.id;

	window.fetch(url)
		.then(function(response){
			return response.json();
		}).then(function(body){
			var extra = {
				header: true
			};

			console.log("START - Venue Recent Render");
			React.render(<List items={ body } itemType={ ListItemSm } extra={ extra } />, venueRecent);
			console.log("END - Venue Recent Render");

		});
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
if(!window.user.authenticated){
	profileButton.on('click',function(e){
		React.render(<AuthModal visible={true} />,$('#overlay-wrapper')[0])
		$('#overlay').on('click',function(e){
			if (e.target.id === "overlay") {
				React.render(<AuthModal visible={false} />,$('#overlay-wrapper')[0])
			}
		})
	})
}else{
	profileButton.on('click',function(e){
		window.location.href = '/user/profile'
	})
}
/* AUTHENTICATION END */




/* USER PROFILE */
if(document.getElementById('profile') != null){
	React.render(<UserProfile profile={window.user} />,document.getElementById('profile'));
}
/* USER PROFILE END*/


