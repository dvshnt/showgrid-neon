import React, { Component } from 'react';
import $ from 'jQuery';

import Showgrid from './components/Showgrid';

var calendar = document.getElementById("calendar")
if (!!calendar) {
	console.log("START - Calendar Render");
	React.render(<Showgrid days={ days } venues={ venues } />, calendar);
	console.log("END - Calendar Render");
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

