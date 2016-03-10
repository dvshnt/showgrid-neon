import moment from 'moment';
import React from 'react';


var DateManager = {
	formatTicketSaleDate(date) {
		return moment(date, 'YYYY-MM-DD HH:mm:ssZZ').format('ddd[,] M/D [at] h:mm A');
	},

	formatShowTime(date) {
		if (moment(date, 'YYYY-MM-DD HH:mm:ssZZ').format('mm') !== '00') {
			return moment(date, 'YYYY-MM-DD HH:mm:ssZZ').format('h:mm A');
		}

		return moment(date, 'YYYY-MM-DD HH:mm:ssZZ').format('h A');
	},

	getFormattedShowTime(date) {
		return moment(date, 'YYYY-MM-DD HH:mm:ssZZ').format('ddd MMM D, h:mm A');
	},
 
	getShowsOnDate(day, shows) {
		var result = [];

		var date = moment(day, 'YYYY-MM-DD');

		for(var i = 0, len = shows.length; i < len; i++) {
			var show = shows[i];

			var showDate = moment(show.date, 'YYYY-MM-DD HH:mm:ssZZ').format('MMMM Do YYYY');
			    		
			if (date.isSame(moment(showDate, 'MMMM Do YYYY'))) {
				result.push(show);
	    	}
	    }

	    return result;
	},

	areTicketsOnSale(date) {
		var saleDate = moment(date, 'YYYY-MM-DD HH:mm:ssZZ');

		if (saleDate.isAfter(moment())) {
			return false;
		}
		return true;
	},

	formatSaleDate(date) {
		return moment(date, 'YYYY-MM-DD HH:mm:ssZZ').format('M/D') + " at " + moment(date, 'YYYY-MM-DD HH:mm:ssZZ').format('h a');
	},

	formatHeaderCalendarDay(day) {
		var date = moment(day, 'YYYY-MM-DD'),
			date = date.format('ddd  M/D');

		return date;
	},

	getDaysArray(start, offset) {
		var result = [];

		var day = start;
		for (var i = 0; i < offset; i++) {
			result.push({
				"id": i,
				"date": day.format('MMMM Do YYYY')
			});

			day.add(1, 'days');
		}

		return result;
	},

	getStartOfNextPage(end) {
		var day = moment(end, 'MMMM Do YYYY'),
			day = day.add(1, 'days');

		return day;
	},

	getStartOfPreviousPage(previousStart, offset) {
		var day = moment(previousStart, 'MMMM Do YYYY'),
			day = day.subtract(offset, 'days');

		return day;
	},

	getMonthFromDate(date) {
		return moment(date, 'YYYY-MM-DD HH:mm:ssZZ').format('MMM');
	},

	getDayFromDate(date) {
		return moment(date, 'YYYY-MM-DD HH:mm:ssZZ').format('D');
	},

	getMobileDate(date) {
		var currentDate = date;
		var today = moment().hour(0).minute(0).second(0);

		var diff = Math.round(currentDate.diff(today, 'days', true));

		if (diff === 0) {
			return "TODAY";
		}
		else if (diff === -1 ) {
			return "YESTERDAY";
		}
		else if (diff === 1 ) {
			return "TOMORROW";
		}
		else if (diff < 7 && diff > 1) {
			return currentDate.format("dddd").toUpperCase();
		}
		else {
			return currentDate.format("dddd, MMM Do").toUpperCase();
		}
	},

	// getFeaturedShowDate(date) {
	// 	var today = moment().hour(0).minute(0).second(0);

	// 	var diff = Math.round(date.diff(today, 'days', true));

	// 	if (diff === -1) {
	// 		return "Yesterday";
	// 	}
	// 	else if (diff === 0) {
	// 		return "Today";
	// 	}
	// 	else if (diff === 1 ) {
	// 		return "Tomorrow";
	// 	}
	// 	else if (diff < 7 && diff > 1) {
	// 		return date.format("dddd");
	// 	}
	// 	else {
	// 		return date.format("dddd, MMMM Do");
	// 	}
	// },

	getUpcomingShowDate(date) {
		var today = moment();

		var diff = Math.round(date.diff(today, 'days', true));

		if (diff === -1) {
			return "Yesterday";
		}
		else if (diff === 0) {
			return "Today";
		}
		else if (diff === 1 ) {
			return "Tomorrow";
		}
		else if (diff < 7 && diff > 1) {
			return date.format("dddd");
		}
		else {
			return date.format("dddd, MMMM Do");
		}
	},

	getRecentShowsDate(date) {
		
		var currentDate = moment(date, 'YYYY-MM-DD');
		var today = moment().hour(0).minute(0).second(0);

		var diff = Math.round(currentDate.diff(today, 'days', true));

		if (diff === 0) {
			return "Added Today";
		}
		else if (diff === -1 ) {
			return "Added Yesterday";
		}
		else {
			return "Added " + currentDate.format("dddd, MMMM Do");
		}
	},

	generateRecentBadge(show) {
		var created = moment(show.created_at.split('T')[0], 'YYYY-MM-DD');
		var today = moment().hour(0).minute(0).second(0);

		var diff = Math.round(created.diff(today, 'days', true));

		if (diff === 0) {
			return <b title="Added Today" className="icon-recent"></b>;
		}
		else if (diff === -1 ) {
			return <b title="Added Yesterday" className="icon-recent one"></b>;
		}
		else if (diff === -2 ) {
			return <b title="Added Two Days Ago" className="icon-recent two"></b>;
		}
		else  {
			return "";
		}
	},

	getAlertDate(date, offset) {
		return moment(date).subtract(offset.num, offset.unit);
	},

	convertAlertDate(dateId) {
		switch(dateId) {
		case 0:
			return "At time of show";
		case 1:
			return "30 Minutes before show";
		case 2:
			return "1 Hour before show";
		case 3:
			return "2 Hours before show";
		case 4:
			return "1 Day before show";
		case 5:
			return "2 Days before show";
		case 6:
			return "1 week before show";
		case 7:
			return "When tickets go on sale";
		case 8:
			return "30 Minutes before tickets go on sale";
		case 9:
			return "1 Hours before tickets go on sale";
		case 10:
			return "2 Hours before tickets go on sale";
		default:
			return "Sometime before the show";
		}
	},
};


module.exports = DateManager;