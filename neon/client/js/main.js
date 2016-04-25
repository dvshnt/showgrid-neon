function getCookie(name){
	var re = new RegExp(name + "=([^;]+)");
	var value = re.exec(document.cookie);
	return (value != null) ? unescape(value[1]) : null;
}

import React, { Component } from 'react';
import dom from 'react-dom';

import $ from 'jquery';
import fetch from 'whatwg-fetch';


import Showgrid from 'components/Showgrid';
import ListLg from 'components/ListLg';
import ListSm from 'components/ListSm';

import * as op from 'operator.js';

window.operator = op;







import ShowActions from 'components/ShowActions.js';

function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)", "i"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}


var calendar = document.getElementById("calendar");

if (!!calendar) {
	console.log("START - Calendar Render");
	dom.render(<Showgrid days={ window.state.days } venues={ window.state.venues } />, calendar);
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
	dom.render(<ListLg items={ shows } extra={ extra }/>, featured);
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
	dom.render(<ListLg items={ window.state.featured_shows } extra={ extra }/>, frontFeatured);
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
	dom.render(<ListLg items={ shows } extra={ extra }/>, search);
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
			dom.render(<ListLg items={ body } extra={ extra }/>, venueShows);
			console.log("END - Venue Shows Render");
		});
}


var venueRecent = document.getElementById("venue-recent");
if (!!venueRecent) {
	var url = '/api/v1/shows?orderby=created_at&limit=5&venue=' + venue.id;

	window.fetch(url)
		.then(function(response) {
			return response.json();
		}).then(function(body){
			var extra = {
				header_recent: true
			};

			console.log("START - Venue Recent Render");
			dom.render(<ListSm items={ body } extra={ extra } />, venueRecent);
			console.log("END - Venue Recent Render");
		});
}





var frontOnsale = document.getElementById("front-onsale");

if (!!frontOnsale) {
	var url = '/api/v1/shows?orderby=onsale&limit=5&onsale=true';

	window.fetch(url)
	.then(function(response) {
		return response.json();
	})
	.then(function(body) {

		var extra = {
			header_onsale: true,
			onsale_info: true
		};

		console.log("START - Venue Recent Render");
		dom.render(<ListSm items={ body } extra={ extra } />, frontOnsale);
		console.log("END - Venue Recent Render");
	})
}



var frontRecent = document.getElementById("front-recent");
if (!!frontRecent) {
	var url = '/api/v1/shows?orderby=created_at&limit=5';

	window.fetch(url)
	.then(function(response) {
		return response.json();
	})
	.then(function(body) {
		var extra = {
			header_recent: true
		};

		console.log("START - Venue Recent Render");
		dom.render(<ListSm items={ body } extra={ extra } />, frontRecent);
		console.log("END - Venue Recent Render");
	});
}



var showActions = document.getElementById('show-actions-mobile') || document.getElementById('show-actions-wide')
if (!!showActions) {
	dom.render(<ShowActions show={window.state.show} />, document.getElementById('show-actions-mobile'));
	dom.render(<ShowActions show={window.state.show} />, document.getElementById('show-actions-wide'));
}




$("#search-toggle").click(function(e){
	var searchBar = $("#subhead");
	if (searchBar.hasClass("active")){
		searchBar.removeClass("active")
		return;
	}
	searchBar.addClass("active");
})




if(getParameterByName('q') == "profile") op.renderAuthModal()



/* AUTHENTICATION */
$("#profile-button").on('click',function(e){
	// console.log("VISIBLE")
	if(window.user.is_authenticated) return window.location.href = '/user/profile'
	op.renderAuthModal()
})



window.user.csrf = getCookie('csrftoken');




if(window.innerWidth < 600){
	window.compact = true;
}else{
	window.compact = false;
}
window.addEventListener('resize',(e)=>{
	if(window.innerWidth < 600){
		window.compact = true;
	}else{
		window.compact = false;
	}
})



