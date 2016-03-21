import React, { Component } from 'react';
import FormButton from './FormButton';
import PhoneModal from './PhoneModal'
import $ from 'jquery';
import DateManager from '../util/DateManager'
import moment from 'moment'
import {SetAlert} from './SetAlert'

var GridEngine = require('../util/GridEngine');




function unfavoriteShow(fav,cb){
	$.ajax({
		type: 'DELETE',
		url: '/user/rest/favorite',
		data: JSON.stringify({show:fav.id}),
		success: cb,
		error: function(e){
			throw e
		}
	})
}



function removeAlert(alert,cb){
	var index  = window.user.alerts.indexOf(alert)
	$.ajax({
		data: JSON.stringify({alert:alert.id}),
		dataType: 'json',
		type:'DELETE',
		url:'/user/rest/alert',
		success: cb,
		error: function(e){
			throw e;
		}
	})
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


		if(number == "None" || number == "" || number == null){
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
				<UserActions tab = {this.props.tab} alerts = {window.user.alerts} favorites = {window.user.favorites} />
			</div>
		)
	}
};









class UserActions extends Component {
	constructor(props) {
		super(props);

		this.selectTab = this.selectTab.bind(this);

		this.state = {
		
		
		};
	}

	selectTab(e) {
		React.render(<UserProfile tab = {e.target.className.indexOf("alerts") !== -1 ? 'alert' : 'fav'} profile={window.user} />,document.getElementById('profile'));
		e.preventDefault()
	}

	render() {
		
		var alertTabClass = (this.props.tab == 'alert') ? "tab alerts selected" : "tab alerts";
		var favoritesTabClass = (this.props.tab == 'fav') ? "tab favorites selected" : "tab favorites";

		


	
		var items = []
		if (this.props.tab == 'alert') {
			for (var i=0; i < this.props.alerts.length; i++) {
				items.push(<UserAlert  key= {'user_alert_'+i} alert={ this.props.alerts[i] }/>);
			}

			if (items.length == 0) {
				items = (
					<div className="info-text">
						<h2>No Alerts Set</h2>
						<p>Set a reminder on a show by clicking the <b className="icon-alert"></b> icon and selecting a time. You will receive a text at the chosen time reminding you about the show and providing you with a link to buy tickets.</p>
					</div>
				);
			}
		}else if(this.props.tab == 'fav'){
			for (var i=0; i < this.props.favorites.length; i++) {
				items.push(<UserFavorite key= {'user_fav_'+i} favorite={ this.props.favorites[i] }/>);
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

	// removeAlert(e){
	// 	removeAlert(this.props.alert,function(data){
	// 		console.log('GOT SUCC',data)
	// 		window.user.alerts.splice(window.user.alerts.indexOf(this.props.alert),1);
	// 		React.render(<UserProfile profile={window.user} />,document.getElementById('profile'));
	// 	}.bind(this))
	// }

	// /* change alert ajax request */
	// changeAlert(e){
	// 	var which = e.target.value 
	// 	var value = e.target.options[which].getAttribute('data-value')
	// 	console.log(value)
	// 	var date = DateManager.getAlertDate(this.props.alert.show_date, JSON.parse(value));
	// 	var show = this.props.alert.show;
		
	// 	$.ajax({
	// 		data: JSON.stringify({ alert: this.props.alert.id, date: date, which: which }),
	// 		dataType: 'json',
	// 		type: 'PUT',
	// 		url:'/user/rest/alert',
	// 		success: function(data){
	// 			console.log('edit alert got succ',data)
	// 		},
	// 		error: function(e){ console.log(e) }
	// 	})
	// }

	render() {
		var alert = this.props.alert;

		var alertRef = "alert-" + alert.id;

		var month = DateManager.getMonthFromDate(alert.show.raw_date);
		var day = DateManager.getDayFromDate(alert.show.raw_date);

		var date = (
			<div className="date">
				<div>{ month }</div>
				<div>{ day }</div>
			</div>
		);



		var venue = <h4>{ alert.show.venue.name }</h4>;

		var headliner = "";
		var opener = "";

		if (alert.show_headliners !== '') {
			headliner = <h3>{ alert.show.headliners }</h3>;
		}

		if (alert.show_openers !== '') {
			opener =  <h5>{ alert.show.openers }</h5>;
		}


		return (
			<div className="alert-block" ref={ alertRef }>
				{ date }
				<div className="info">
					{ venue }
					{ headliner }
					{ opener }
				</div>
				<SetAlert show={alert.show} />
			</div>
		)
	}
};






















class UserFavorite extends Component {
	constructor(props) {
		super(props);
	}


	unFavorite(){
	
		unfavoriteShow(this.props.favorite,function(){
			var i = window.user.favorites.indexOf(this.props.favorite)
			window.user.favorites.splice(i,1)
			React.render(<UserProfile tab = 'fav' profile={window.user} />,document.getElementById('profile'));				
		}.bind(this))
		
	}


	render() {

		var headliners,openers = null;
		if (this.props.favorite.headliners !== '') headliners = <h3>{ this.props.favorite.headliners }</h3>;
		if (this.props.favorite.openers !== '') openers =  <h5>{ this.props.favorite.openers }</h5>;
		

		return (
			<div className="alert-block">
				<div className="date">
					<div>{ DateManager.getMonthFromDate(this.props.favorite.date) }</div>
					<div>{ DateManager.getDayFromDate(this.props.favorite.date) }</div>
				</div>
				<div className="info">
					 <h4>{ this.props.favorite.venue.name }</h4>
					{ headliners }
					{ openers }
				</div>
				<div className="favorite">
					<a onClick={ this.unFavorite.bind(this) } href="#">Remove</a>
				</div>
			</div>
		)
	}
};










export default UserProfile


