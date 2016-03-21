import React, { Component } from 'react';
import $ from 'jquery';
import DateManager from '../util/DateManager';
import moment from 'moment';
import AuthModal from './AuthModal';

class SetAlert extends Component {
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
		
		if(this.state.open == false) return
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


		$.ajax({
			type: 'post',
			url: '/user/rest/alert',
			data: JSON.stringify({
				date: alertDate.format(),
				show: show.id,
				which: value.id,
				sale: value.sale
			}),
			error: function(data){
				console.log("SET ALERT GOT ERROR STATUS",data)
				if (data.status === "phone_not_verified") {
					_this.props.showPhoneModal();
					
					_this.setState({
						open: false
					});
				}		
			},
			success: function(data){
				console.log("SET ALERT GOT SUCC STATUS",data)
				if(data.status === "phone_not_verified"){
					_this.setState({
						active: null,
						open: false
					});
					React.render(<PhoneModal visible={true} />,document.getElementById('overlay-wrapper'));							
				}else{
					window.user.alerts.push(data)
					_this.setState({
						active: data,
						sale: value.sale,
						open: false
					});
				}
			}
		})		
	}

	cancelAlert() {
		console.log("CANCEL ALERT")
		var _this = this

		if(this.state.active == null){
			throw 'cannot cancel alert because none exists for current show.'
		}

		var id = this.state.active.id 

		$.ajax({
			type: 'delete',
			url: '/user/rest/alert',
			data: JSON.stringify({
				alert: this.state.active.id 
			}),
			error: function(data){
				throw data	
			},
			success: function(data){
				window.user.alerts.splice(window.user.alerts.findIndex(function(a){ return a.id == id}),1)
				_this.setState({
					active: null,
					open: false
				});	
			}
		})

		this.setState({
			active: null,
			open: false,
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

	render() {
		var _this = this;

		var alertInfo, alertText = "";

		if (this.state.active) {
			alertText = DateManager.convertAlertDate(this.state.active.which);
			alertInfo = <div className="alert-info">{ alertText }</div>;
		}

		var artistInfo = (
			<div className="artist-info">
				<span>{ moment(this.props.show.raw_date).format("ddd MMM Mo, h A") }</span>
				<h4>{ this.props.show.headliners }</h4>
				<h5>{ this.props.show.openers }</h5>
			</div>	
		);



		var className = (this.state.open) ? "col-3 icon-alert open" : "col-3 icon-alert";
			className += (this.state.active) ? " active" : "";
			className += (this.state.sale) ? " sale" : "";

		var options = this.getEligibleAlertTimes();
		if( !options.props.children.length){
			return (
				<div className={className} >
					<svg className="icon icon-alert" dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-alert"/>' }} />		
				</div>
			)			
		}

		return (
			<div className={className} onClick={ this.toggleAlert }>
				<svg className="icon icon-alert" dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-alert"/>' }} />
				<div className="alert-box">
					{ artistInfo }
					Alert me
					{ options }
					<div className="mobile-actions">
						<button className="cancel" onClick={ this.toggleAlert }>Cancel</button>
						<button className="set" onClick={ this.createAlert }>Set Alert</button>
					</div>
				</div>
				{ alertInfo }				
			</div>
		)
	}
};












class SetFavorite extends Component {	
	constructor(props) {
		super(props);
		
		if( window.user.is_authenticated == true){
			var match = window.user.favorites.filter(function(fav){
				return fav.id == this.props.show.id
			}.bind(this))
		}else{
			var match = []		
		}
		
		this.state = {
			favorited: match.length
		};
	}

	setShowAsFavorite(e) {
		if(window.user.is_authenticated == false){
			return React.render(React.render(<AuthModal visible={true} />,document.getElementById('overlay-wrapper')))
		}
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














class ShowActions extends Component {
	constructor(props) {
		super(props)
	}

	render(){
		var show = this.props.show


		var onsale = DateManager.areTicketsOnSale(show.onsale);
		var ticket
		if (!onsale) {
			var saleDate = 
			ticket = (
				<div className="onsale">
					On Sale 
					<span className="date">
						{ DateManager.formatSaleDate(show.onsale) }
					</span>
				</div>
			)
		}else if (show.ticket !== '') {
			if(this.props.show.ticket){
				ticket = (
					<a className="ticket" href={ show.ticket } target="_blank" onClick={ this.registerTicketEvent }>
						<svg className="icon icon-ticket" dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-ticket"/>' }} />
						<span className="ticket-price"> <span className="number">${show.price}</span></span>
					</a>
				);
			}else{
				ticket = (
					<a className="ticket" href={ show.ticket } target="_blank" onClick={ this.registerTicketEvent }>
						<svg className="icon icon-ticket" dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-ticket"/>' }} />Tickets
					</a>
				);
			}
		}

		if (show.soldout) {
			ticket = <div className="soldout">Sold Out</div>;
		}

		return (
			<div className = 'show-actions-wrapper'>
				<SetFavorite show={ show } />
				<SetAlert show={ show }  />
				<div className="col-3" onClick = {this.setShare} >
					<svg className="icon icon-share" dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-share"/>' }} />
					<span>Share</span>
				</div>
				<div className="col-3">
					{ ticket }
				</div>
			</div>
		)
	}
}

export {SetAlert, ShowActions};


