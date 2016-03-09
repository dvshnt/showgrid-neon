import React, { Component } from 'react';
import FormButton from './FormButton';
import PhoneModal from './PhoneModal'
import $ from 'jquery';
import '../util/csrf'
import DateManager from '../util/DateManager'

var GridEngine = require('../util/GridEngine');




function unfavoriteShow(fav){
	$.ajax({
		type: 'DELETE',
		url: 'user/rest/favorite',
		data: JSON.stringify({show:fav.show_id}),
		success: function(){
			var i = window.user.favorites.indexOf(fav)
			console.log("UNFAVORITE SHOW INDEX",i)
			window.user.favorites.splice(i,1)
			React.render(<UserProfile profile={window.user} />,document.getElementById('profile'));
		},
		error: function(e){
			throw e
		}
	})
}

function changeAlert(e,alert,component){
	var alertDate = DateManager.getAlertDate(alert.show_date, value);



	var show = this.props.alert.show;

	var options = e.target.options;
	var value = "";


	for (var i = 0, l = options.length; i < l; i++) {
		if (options[i].selected) {
			value = JSON.parse(options[i].getAttribute('data-value'));
		}
	}

	var alertDate = DateManager.getAlertDate(alert.show_date, value);


	$.ajax({
		data: JSON.stringify(),
		dataType: 'json',
		success: function(data){
			alert.show_date = data.show_date
			component.forceUpdate()
		},
		error: function(e){
			throw e;
		}
	})
}


function removeAlert(alert,component){
	console.log("REMOVE ALERT",alert,window.user.alerts.indexOf(alert))
	// $.ajax({
	// 	data: JSON.stringify(),
	// 	dataType: 'json',
	// 	type:'DELETE',
	// 	url:'user/rest/alert/',
	// 	success: function(data){
			
	// 		React.render(<UserProfile profile={window.user} />,document.getElementById('profile'));
	// 	},
	// 	error: function(e){
	// 		throw e;
	// 	}
	// })
}




class UserProfile extends Component {
	constructor(props) {
		super(props);

		this.updateProfile = this.updateProfile.bind(this);
		this.resetState = this.resetState.bind(this);
		this.logout = this.logout.bind(this);

		this.resetState();
		this.state = {
			update_error: false,
			update_msg: 'Save Changes',
			update_error_msg: "Oops, try again."
		}
	}

	resetState() {
		this.setState({
			update_error: false,
			update_msg: 'Save Changes',	
			update_error_msg: "Oops, try again."		
		})
	}

	updateProfile() {
		var name = React.findDOMNode(this.refs.name).value;
		var email = React.findDOMNode(this.refs.email).value;
		var pass1 = React.findDOMNode(this.refs.pass1).value;
		var pass2 = React.findDOMNode(this.refs.pass2).value;



		if( name == "" && email == "" && pass1 == "" && pass2 == ""){
			return this.setState({
				update_error_msg: "Nothing to save!",
				update_error: true
			})
		}

		if(pass1 !== pass2){
			return this.setState({
				update_error_msg: "Passwords dont match!",
				update_error: true
			})
		}

		$.ajax({
			success: function(){
				console.log('updated')
				this.setState({
					update_msg: 'changes saved!'
				})
			}.bind(this),
			error: function(){
				console.log('failed')
				this.setState({
					error_msg: 'something went wrong!'
				})
			}.bind(this),
			url: '/user/rest/profile',
			type:'PUT',
			dataType: 'json',
			data: JSON.stringify({
				name: name,
				email: email,
				pass: pass1,
			})
		})
	}

	showPhoneModal(){
		React.render(<PhoneModal visible={true} />,document.getElementById('overlay-wrapper'));
	}

	logout() {
		if (localStorage.getItem("token") !== null) {
			localStorage.removeItem("token");
			window.location.replace(GridEngine.domain);
		}
	}

	render() {
		var name, email, number = "";


		if (this.props.profile) {
			email = this.props.profile.email;
			number = this.props.profile.phone;
			name = this.props.profile.name;
		}
		console.log(name)

		if(number == "None"){
			var phone_button = <input ref="phone" className = "error" type="submit" value={"Register Phone"} onClick={this.showPhoneModal}/>
		}else{
			var phone_button = <input ref="phone" type="submit" value={"Change Phone: (+1) ("+ String(number).slice(1)+")"} onClick={this.showPhoneModal}/>
		}
			

		return (
			<div className="user--profile">
				<a href='/user/logout' id="logout-profile">Logout</a>
				<div className="info">

					<div className="section fields">
						<label>Name</label>
						<input onChange = {this.resetState} ref="name" type="text" placeholder= {name || "Your Name" } />
						<label>Email</label>
						<input onChange = {this.resetState} ref="email" type="text" placeholder={email || "Your Email" } />
					</div>
					<div className="section fields">
						<label>Change Password</label>
						<input onChange = {this.resetState} ref="pass1" type="password" placeholder= {"Change Your Password" } />
						<input onChange = {this.resetState} ref="pass2" type="password" placeholder= {"Confirm New Password" } />
					</div>
					<div className="section buttons">
						{phone_button}
						<FormButton error = { this.state.update_error } errorMessage={ this.state.update_error_msg } submitMessage={this.state.update_msg} onClick={ this.updateProfile } />
					</div>
				</div>
				<UserActions alerts = {window.user.alerts} favorites = {window.user.favorites} />
			</div>
		)
	}
};









class UserActions extends Component {
	constructor(props) {
		super(props);

		this.selectTab = this.selectTab.bind(this);

		this.state = {
			tab: 'alert',
		
		};
	}

	selectTab(e) {
		this.setState({
			tab: e.target.className.indexOf("alerts") !== -1 ? 'alert' : 'fav'
		});

		return false;
	}

	render() {
		var alertTabClass = (this.state.tab == 'alert') ? "tab alerts selected" : "tab alerts";
		var favoritesTabClass = (this.state.tab == 'fav') ? "tab favorites selected" : "tab favorites";

		var items = [];
		if (this.state.tab == 'alert') {
			for (var i=0; i < this.props.alerts.length; i++) {
				items.push(<UserAlert alert={ this.props.alerts[i] }/>);
			}

			if (items.length === 0) {
				items = (
					<div className="info-text">
						<h2>No Alerts Set</h2>
						<p>Set a reminder on a show by clicking the <b className="icon-alert"></b> icon and selecting a time. You will receive a text at the chosen time reminding you about the show and providing you with a link to buy tickets.</p>
					</div>
				);
			}
		}else if(this.state.tab == 'fav'){
			for (var i=0; i < this.props.favorites.length; i++) {
				items.push(<UserFavorite show={ this.props.favorites[i] }/>);
			}

			if (items.length === 0) {
				items = (
					<div className="info-text">
						<h2>No Shows Favorited</h2>
						<p>Favorite a show by clicking the <b className="icon-heart"></b> icon on any show you might like. Favoriting helps you track shows that you might go to.</p>
					</div>
				);
			}
		}


		return (
			<div className="user--actions">
				<div className="tabs">
					<button onClick={ this.selectTab } className={ favoritesTabClass }><span><b className="icon-heart"></b>Favorites</span></button>
					<button onClick={ this.selectTab } className={ alertTabClass }><span><b className="icon-alert"></b> Alerts</span></button>
				</div>
				<div className="actions">
					{ items }
				</div>
			</div>
		)
	}
};

















class UserAlert extends Component {
	constructor(props) {
		super(props);
	}

	// componentWillUpdate(nextProps, nextState) {

	// }



	getEligibleAlertTimes() {
		var alert = this.props.alert;
		var show = alert.show;

		var now = moment();
		var date = moment(show.date, 'YYYY-MM-DD HH:mm:ssZZ');

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
				options.push(<option value="10" data-value='{"sale":true, id":10, "unit":"hours","num":2}' selected={ alert.which === 10 }>2 hours before ticket sale starts</option>);
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
		/* ???? */
		return <select onBlur={this.createAlert} onChange={ this.createAlert }>{ options }</select>;
	}

	render() {
		var alert = this.props.alert;

		var alertRef = "alert-" + alert.id;

		var month = DateManager.getMonthFromDate(alert.show_date);
		var day = DateManager.getDayFromDate(alert.show_date);

		var date = (
			<div className="date">
				<div>{ month }</div>
				<div>{ day }</div>
			</div>
		);



		var venue = <h4>{ alert.show_venue_name }</h4>;

		var headliner = "";
		var opener = "";

		if (alert.show.headliners !== '') {
			headliner = <h3>{ alert.show_headliners }</h3>;
		}

		if (alert.show.openers !== '') {
			opener =  <h5>{ alert.show_openers }</h5>;
		}

		var options = this.getEligibleAlertTimes();


		return (
			<div className="alert-block" ref={ alertRef }>
				{ date }
				<div className="info">
					{ venue }
					{ headliner }
					{ opener }
				</div>
				<div className="alert">
					{ options }
					<a onClick={ removeAlert.bind(this,this.props.alert) } href="#">Remove</a>
				</div>
			</div>
		)
	}
};






















class UserFavorite extends Component {
	constructor(props) {
		super(props);
	}

	render() {

		var date = (
			<div className="date">
				<div>{ DateManager.getMonthFromDate(this.props.fav.show_date) }</div>
				<div>{ DateManager.getDayFromDate(this.props.fav.show_date) }</div>
			</div>
		);



		var venue = <h4>{ this.props.fav.show_venue_name }</h4>;

		var headliners,openers = null;


		if (this.props.fav.show_headliners !== '') {
			headliners = <h3>{ this.props.fav.show_headliners }</h3>;
		}

		if (this.props.fav.show_openers !== '') {
			openers =  <h5>{ this.props.fav.show_openers }</h5>;
		}



		return (
			<div className="alert-block">
				{ date }
				<div className="info">
					{ venue }
					{ headliners }
					{ openers }
				</div>
				<div className="favorite">
					<a onClick={ unfavoriteShow.bind(null,this.props.fav) } href="javaScript:void(0);">Remove</a>
				</div>
			</div>
		)
	}
};










export default UserProfile


