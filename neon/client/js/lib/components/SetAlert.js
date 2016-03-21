import React, { Component } from 'react';

import $ from 'jquery';
import moment from 'moment';

import DateManager from '../util/DateManager';

import AuthModal from './AuthModal';
import PhoneModal from './PhoneModal';


export default class SetAlert extends Component {
	constructor(props) {
		super(props);

		this.createAlert = this.createAlert.bind(this);
		this.toggleAlert = this.toggleAlert.bind(this);

		if(window.user.alerts){
			var match = window.user.alerts.filter(function(alert){
				return alert.show.id == this.props.show.id
			}.bind(this))

		}else{
			var match = []
		}
		
		var sale = (match.length) ? match[0].sale  : false;
		
		this.state = {
			open: false,
			active: match[0],
			sale: sale
		};
	}


	createAlert(e) {
		var _this = this;

		var show = this.props.show;
		var date = show.raw_date;

		var options = e.target.options;
		var value = "";

		if (!options) {
			options = this.refs.alertSelect.getDOMNode().options;
		}
		// So we don't create the alert when the dialog changes on mobile
		else if (options && window.innerWidth <= 500) {
			return;
		}


		for (var i = 0, l = options.length; i < l; i++) {
			if (options[i].selected) {
				value = JSON.parse(options[i].getAttribute('data-value'));
			}
		}

		var alertDate = DateManager.getAlertDate(date, value);


		value.sale = value.sale || false

		
		var url = '/user/rest/alert';

		window.fetch(url, {
				method: 'post',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'X-CSRFToken': $("input[name=csrfmiddlewaretoken]").val()
				},
				body: JSON.stringify({
					date: alertDate.format(),
					show: show.id,
					which: value.id,
					sale: value.sale
				})
			})
			.then(function(response) {
				return response.json();
			})
			.then(function(body) {
				if(body.status === "phone_not_verified") {
					_this.setState({
						active: null
					});

					_this.props.selectAlert();

					React.render(<PhoneModal visible={true} />,document.getElementById('overlay-wrapper'));							
				}
				else {
					window.user.alerts.push(body);

					_this.setState({
						active: body,
						sale: value.sale,
						open: false
					});
				}
			});
	}

	cancelAlert() {
		console.log("CANCEL ALERT")
		var _this = this

		if(this.state.active == null){
			throw 'cannot cancel alert because none exists for current show.'
		}

		var id = this.state.active.id 

		var url = '/user/rest/alert';

		window.fetch(url, {
				method: 'delete',
				headers: {
					'Accept': 'application/json',
					'Content-Type': 'application/json',
					'X-CSRFToken': $("input[name=csrfmiddlewaretoken]").val()
				},
				body: JSON.stringify({
					alert: this.state.active.id 
				})
			})
			.then(function(response) {
				return response.json();
			})
			.then(function(body) {
				window.user.alerts.splice(window.user.alerts.findIndex(function(a){ return a.id == id}), 1)

				_this.setState({
					active: null,
					open: false
				});	
			});

		this.setState({
			active: null,
			sale: false
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
			this.props.selectAlert();
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
				options.push(<option value="7"  data-value='{"sale":true, "id":7, "unit":"days","num":0}' selected={ alert.which === 7 }>when ticket sale starts</option>);
			}
			if (now.isBefore(sale_date.clone().subtract(30, 'minutes'))) {
				options.push(<option value="8" data-value='{"sale":true, "id":8, "unit":"minutes","num":30}' selected={ alert.which === 8 }>30 minutes before ticket sale</option>);
			}
			if (now.isBefore(sale_date.clone().subtract(1, 'hours'))) {
				options.push(<option value="9" data-value='{"sale":true, "id":9, "unit":"hours","num":1}' selected={ alert.which === 9 }>1 hour before ticket sale</option>);
			}
			if (now.isBefore(sale_date.clone().subtract(2, 'hours'))) {
				options.push(<option value="10" data-value='{"sale":true, "id":10, "unit":"hours","num":2}' selected={ alert.which === 10 }>2 hours before ticket sale starts</option>);
			}
		}


		if (now.isBefore(date)) {
			options.push(<option value="0" data-value='{"id":0, "unit":"days","num":0}' selected={ alert.which === 0 }>At time of show</option>);
		}

		if (now.isBefore(date.clone().subtract(30, 'minutes'))) {
			options.push(<option value="1" data-value='{"id":1, "unit":"minutes","num":30}' selected={ alert.which === 1 }>30 Minutes before show</option>);
		}

		if (now.isBefore(date.clone().subtract(1, 'hours'))) {
			options.push(<option value="2" data-value='{"id":2, "unit":"hours","num":1}' selected={ alert.which === 2 }>1 Hour before show</option>);
		}


		if (now.isBefore(date.clone().subtract(2, 'hours'))) {
			options.push(<option value="3" data-value='{"id":3, "unit":"hours","num":2}' selected={ alert.which === 3 }>2 Hours before show</option>);
		}


		if (now.isBefore(date.clone().subtract(1, 'days'))) {
			options.push(<option value="4" data-value='{"id":4, "unit":"days","num":1}' selected={ alert.which === 4 }>1 Day before show</option>);
		}


		if (now.isBefore(date.clone().subtract(2, 'days'))) {
			options.push(<option value="5" data-value='{"id":5, "unit":"days","num":2}' selected={ alert.which === 5 }>2 Days before show</option>);
		}


		if (now.isBefore(date.clone().subtract(7, 'days'))) {
			options.push(<option value="6" data-value='{"id":6, "unit":"days","num":7}' selected={ alert.which === 6 }>1 Week before show</option>);
		}

		return <select ref="alertSelect">{ options }</select>;
	}

	render() {
		var _this = this;

		var alertInfo = "";

		if (this.state.active) {
			alertInfo = DateManager.convertAlertDate(this.state.active.which);
		}
		else {
			alertInfo = "Set Alert";
		}


		var className = "col-3 alert";
			className += (this.state.active) ? " active" : "";
			className += (this.state.sale) ? " sale" : "";

		var options = this.getEligibleAlertTimes();
		if( !options.props.children.length){
			return (
				<div className={className} >
					<svg className="icon icon-alert" dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-alert"/>' }} />		
					<span>Show Started</span>
				</div>
			)			
		}

		return (
			<div className={ className } onClick={ this.toggleAlert }>
				<svg className="icon icon-alert" dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-alert"/>' }} />
				<span>{ alertInfo }</span>
				<div className="alert-box">
					Alert me
					{ options }
					<div className="actions">
						<button className="set" onClick={ this.createAlert }>Set Alert</button>
						<button className="cancel" onClick={ this.toggleAlert }>Cancel</button>
					</div>
				</div>				
			</div>
		)
	}
};