import React, { Component } from 'react';
import $ from 'jquery';

import fetch from 'whatwg-fetch';

import Showgrid from './components/Showgrid';

import List from './components/List';
import ListItemLg from './components/ListItemLg';
import ListItemSm from './components/ListItemSm';


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
				date_heading: true,
				showStar: true,
				showGradient: true
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
		.then(function(response) {
			return response.json();
		}).then(function(body) {
			var extra = {
				header_recent: true
			};

			console.log("START - Venue Recent Render");
			React.render(<List items={ body } itemType={ ListItemSm } extra={ extra } />, venueRecent);
			console.log("END - Venue Recent Render");

		});
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

	window.fetch(url)
		.then(function(response) {
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


$("#search-toggle").click(function(e) {
	var searchBar = $("#subhead");

	// if (!!calendar) searchBar.addClass("calendar");

	if (searchBar.hasClass("active")) {
		searchBar.removeClass("active");
		return;
	}
	searchBar.addClass("active");
});

