import React, { Component } from 'react';
import $ from 'jQuery';

import fetch from 'whatwg-fetch';

import Showgrid from './components/Showgrid';

import List from './components/List';
import ListItemLg from './components/ListItemLg';
import ListItemSm from './components/ListItemSm';


var calendar = document.getElementById("calendar")
if (!!calendar) {
	console.log("START - Calendar Render");
	React.render(<Showgrid days={ days } venues={ venues } />, calendar);
	console.log("END - Calendar Render");
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

	if (!!calendar) searchBar.addClass("calendar");

	if (searchBar.hasClass("active")) {
		searchBar.removeClass("active");
		return;
	}
	searchBar.addClass("active");
});

