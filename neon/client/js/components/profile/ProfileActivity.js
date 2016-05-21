import React, { Component } from 'react';
import moment from 'moment';
import ListItemSm from 'components/ListItemSm'
import FavoriteButton from './FavoriteButton';
import AlertButton from './AlertButton';
import $ from 'jquery';
import * as op from 'operator';

var ProfileActivity = React.createClass({

	getInitialState: function() {
		return {
			tab: 'alerts'
		}
	},
	
	getDefaultProps: function() {
		return {
			date_str: ["at time of ","30 minutes","one hour","two hours","a day","two days","a week"],
		}
	},

	showAlerts: function() {
		this.setState({
			tab: 'alerts'
		})
	},

	showFavorites: function() {
		this.setState({
			tab: 'favorites'
		})
	},

	toShow: function(id) {
		window.location.href = '/show/' + id;
	},

	makeAlert: function(alert, i) {
		var d = moment(alert.show.date);
		var alert_time = (alert.which != 0) ? (this.props.date_str[alert.which] + ' before ') : null;
		
	
		return (
			<div className='profile-alert' key={ i } style={{ 'background': i % 2 ? '#F9F9F9' : '#FFFFFF' }} >
				<div onClick={ this.toShow.bind(this, alert.show.id) } className='profile-alert-info'>
					<div className='profile-alert-info-extra'>
						<span className="venue" style={{ "color": alert.show.venue.primary_color }}>{ alert.show.venue.name }</span>
						<span className="headliner">{ alert.show.headliners }</span>
						<span className="opener">{ alert.show.openers }</span>
					</div>
					<div onClick ={ ()=>{ window.location.href = '/show/'+alert.show.id }} className='profile-alert-info-date'>
						<span className='profile-alert-info-date-which'>{alert_time}</span>
						<span className='profile-alert-info-date-hour'>{d.format("h:mm a")}</span>
						<span className='profile-alert-info-date-day'>{d.format("MMMM Do")}</span>
					</div>
				</div>
				<div className='profile-alert-icon' style={{'background': i%2 ? 'rgb(241, 241, 241)' : 'rgb(251, 251, 251)'}}>
					<AlertButton show={alert.show} />
				</div>
			</div>
		)
	},

	makeFavorite: function(show,i){
		var d = moment(show.date);
		return (
			<div className='profile-alert' key={ i } style={{'background': i%2 ? '#F9F9F9' : '#FFFFFF'}} >
				<div onClick={ this.toShow.bind(this, show.id) } className='profile-alert-info'>
					<div clasName='profile-alert-info-extra' >
						<span className="venue" style={{ "color": show.venue.primary_color }}>{ show.venue.name }</span>
						<span className="headliner">{ show.headliners }</span>
						<span className="opener">{ show.openers }</span>
					</div>
					<div onClick = {()=>{window.location.href = '/show/'+show.id}} width={200} vertical center c='profile-alert-info-date'>
						<span className='profile-alert-info-date-hour'>{d.format("h:mm a")}</span>
						<span className='profile-alert-info-date-day'>{d.format("MMMM Do")}</span>
					</div>
				</div>
				<div className='profile-alert-icon' style={{'background': i%2 ? 'rgb(241, 241, 241)' : 'rgb(251, 251, 251)'}}>
					<FavoriteButton show={show} />
				</div>
			</div>
		)
	},

	componentDidMount: function(){
		$('.profile-pic').on('click',function(){
			op.showProfileSettings()
		}.bind(this))
	},

	render: function(){
		console.log(this.props.profile);
		if(this.state.tab == 'alerts'){
			var items = this.props.profile.alerts.map(this.makeAlert)
			if(!items.length){
				if(!this.props.profile.phone_verified){
					items = <div onClick={ op.showProfileSettings.bind(null,2) } className='profile-activity-overlay'><div className = 'button-green'>Set up phone to recieve alerts</div></div>
				}else{
					items = <div className='profile-activity-overlay'><h3 className = 'profile-'>No Alerts Set</h3></div>
				}
				
			}
		}else if(this.state.tab == 'favorites'){
			var items = this.props.profile.favorites.map(this.makeFavorite)
			if(!items.length){
				items = <div className='profile-activity-overlay'><h3 className = 'profile-'>No Shows Favorited</h3></div>
			}

		}

		if(items.length == []){
			this.state.tab == 'alerts'
		}


		return (
			<div>
				<div className="profile-activity-options">
					<span className = {'profile-activity-option ' + (this.state.tab == 'alerts' ? 'profile-activity-option-active-alerts': '')} onClick = {this.showAlerts} >Alerts</span>
					<span className = {'profile-activity-option ' + (this.state.tab == 'favorites' ? 'profile-activity-option-active-favorites' : '')} onClick = {this.showFavorites} >Favorites</span>
				</div>
				<div className="profile-activity-items">
					{items}
				</div>
			</div>
		)
	}
})


export default ProfileActivity

