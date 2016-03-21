import React, { Component } from 'react';

import $ from 'jquery';
import moment from 'moment';

import DateManager from '../util/DateManager';

import Share from './Share';
import Ticket from './Ticket';
import SetAlert from './SetAlert';
import SetFavorite from './SetFavorite';

import AuthModal from './AuthModal';


export default class ShowActions extends Component {
	constructor(props) {
		super(props)

		this.selectAlert = this.selectAlert.bind(this);
		this.toggleShare = this.toggleShare.bind(this);

		this.state = {
			selectAlert: false,
			selectShare: false
		};
	}

	selectAlert() {
		var _this = this;
		this.setState({
			selectAlert: !_this.state.selectAlert
		});
	}


	toggleAlert(e) {
		if(window.user.is_authenticated == false){
			return React.render(React.render(<AuthModal visible={true} />,document.getElementById('overlay-wrapper')))
		}
	
		if (e.target.localName === "select"){
			e.preventDefault()
			return
		}

		if (this.state.active) {
			this.cancelAlert();
		}
		else {
			var _this = this;
			this.setState({
				open: !_this.state.open
			});
		}
	}

	getEligibleAlertTimes() {
		var show = this.props.show;

		var now = moment();

		var date = moment(show.raw_date, 'YYYY-MM-DD HH:mm:ssZZ');
		

		var options = [];
		
		if(show.onsale){
			var sale_date = moment(show.onsale, 'YYYY-MM-DD HH:mm:ssZZ');
			if (now.isBefore(sale_date)) {
				options.push(<option value="7"  data-value='{"sale":true, "id":7, "unit":"days","num":0}' value={ alert.which === 7 }>when ticket sale starts</option>);
			}
			if (now.isBefore(sale_date.clone().subtract(30, 'minutes'))) {
				options.push(<option value="8" data-value='{"sale":true, "id":8, "unit":"minutes","num":30}' value={ alert.which === 8 }>30 minutes before ticket sale</option>);
			}
			if (now.isBefore(sale_date.clone().subtract(1, 'hours'))) {
				options.push(<option value="9" data-value='{"sale":true, "id":9, "unit":"hours","num":1}' value={ alert.which === 9 }>1 hour before ticket sale</option>);
			}
			if (now.isBefore(sale_date.clone().subtract(2, 'hours'))) {
				options.push(<option value="10" data-value='{"sale":true, "id":10, "unit":"hours","num":2}' value={ alert.which === 10 }>2 hours before ticket sale starts</option>);
			}
		}


		if (now.isBefore(date)) {
			options.push(<option value="0" data-value='{"id":0, "unit":"days","num":0}' value={ alert.which === 0 }>At time of show</option>);
		}

		if (now.isBefore(date.clone().subtract(30, 'minutes'))) {
			options.push(<option value="1" data-value='{"id":1, "unit":"minutes","num":30}' value={ alert.which === 1 }>30 Minutes before show</option>);
		}

		if (now.isBefore(date.clone().subtract(1, 'hours'))) {
			options.push(<option value="2" data-value='{"id":2, "unit":"hours","num":1}' value={ alert.which === 2 }>1 Hour before show</option>);
		}


		if (now.isBefore(date.clone().subtract(2, 'hours'))) {
			options.push(<option value="3" data-value='{"id":3, "unit":"hours","num":2}' value={ alert.which === 3 }>2 Hours before show</option>);
		}


		if (now.isBefore(date.clone().subtract(1, 'days'))) {
			options.push(<option value="4" data-value='{"id":4, "unit":"days","num":1}' value={ alert.which === 4 }>1 Day before show</option>);
		}


		if (now.isBefore(date.clone().subtract(2, 'days'))) {
			options.push(<option value="5" data-value='{"id":5, "unit":"days","num":2}' value={ alert.which === 5 }>2 Days before show</option>);
		}


		if (now.isBefore(date.clone().subtract(7, 'days'))) {
			options.push(<option value="6" data-value='{"id":6, "unit":"days","num":7}' value={ alert.which === 6 }>1 Week before show</option>);
		}

		return <select ref="alertSelect" onBlur={this.createAlert} onChange={ this.createAlert }>{ options }</select>;
	}


	toggleShare() {

		var _this = this;
		this.setState({
			selectShare: !_this.state.selectShare
		});
	}

	render(){
		var show = this.props.show;

		var mode = this.state.selectAlert ? "dialog-active" : "";

		if (mode === "") {
			mode = this.state.selectShare ? "share-active" : "";
		}
		

		return (
			<div className={ mode }>
				<SetFavorite show={ show } />
				<SetAlert show={ show } selectAlert={ this.selectAlert }/>
				<Share show={ show } toggleShare={ this.toggleShare }/>
				<Ticket show={ show } />
			</div>
		)
	}
};