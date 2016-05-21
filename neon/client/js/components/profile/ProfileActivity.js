import React, { Component } from 'react';
import moment from 'moment';
import I from 'intui/source/Slide';
import ListItemSm from 'components/ListItemSm'
import FavoriteButton from './FavoriteButton';
import AlertButton from './AlertButton';
import $ from 'jquery';
import * as op from 'operator';

var ProfileActivity = React.createClass({

	getInitialState: function(){
		return {
			tab: 'alerts'
		}
	},

	showAlerts: function(){
		this.setState({
			tab: 'alerts'
		})
	},

	showFavorites: function(){
		this.setState({
			tab: 'favorites'
		})
	},

	makeAlert: function(alert,i){
		var d = moment(alert.show.date);
		var alert_time = (alert.which != 0) ? (this.date_str[alert.which] + ' before ') : null
		
	
		return (
			<I height = {120} c={'profile-alert'} key={"profile_alert_"+i} style={{'background': i%2 ? '#F1F1F1' : '#F9F9F9'}} >
				<I onClick = {this.toShow.bind(this,alert.show.id)} c={'profile-alert-info'} >
					<I c='profile-alert-info-extra' >
						<ListItemSm data = {alert.show} extra = {{show_date:false,hideHeader:true}} />
					</I>
					<I onClick = {()=>{window.location.href = '/show/'+alert.show.id}} width={200} vertical center c='profile-alert-info-date'>
						<span className='profile-alert-info-date-which'>{alert_time}</span>
						<span className='profile-alert-info-date-hour'>{d.format("h:mm a")}</span>
						<span className='profile-alert-info-date-day'>{d.format("MMMM Do")}</span>
					</I>
				</I>
				<I center width = {120} c={'profile-alert-icon'} style={{'background': i%2 ? 'rgb(241, 241, 241)' : 'rgb(251, 251, 251)'}}>
					<AlertButton show={alert.show} />
				</I>
			</I>
		)
	},

	makeFavorite: function(show,i){
		var d = moment(show.date);
		return (
			<I height = {120} c={'profile-alert'} key={"profile_alert_"+i} style={{'background': i%2 ? '#F1F1F1' : '#F9F9F9'}} >
				<I c={'profile-alert-info'} >
					<I c='profile-alert-info-extra' >
						<ListItemSm data = {show} extra = {{show_date:false,hideHeader:true}} />
					</I>
					<I onClick = {()=>{window.location.href = '/show/'+show.id}} width={200} vertical center c='profile-alert-info-date'>
						<span className='profile-alert-info-date-hour'>{d.format("h:mm a")}</span>
						<span className='profile-alert-info-date-day'>{d.format("MMMM Do")}</span>
					</I>
				</I>
				<I center width = {120} c={'profile-alert-icon'} style={{'background': i%2 ? 'rgb(241, 241, 241)' : 'rgb(251, 251, 251)'}}>
					<FavoriteButton show={show} />
				</I>
			</I>
		)
	},

	componentDidMount: function(){
		$('.profile-pic').on('click',function(){
			op.showProfileSettings(0)
		}.bind(this))
	},

	render: function(){
		console.log(this.props.profile);
		if(this.state.tab == 'alerts'){
			var items = this.props.profile.alerts.map(this.makeAlert)
			if(!items.length){
				if(!this.props.profile.phone_verified){
					items = <div onClick = {op.showProfileSettings.bind(null,2)} className='profile-activity-overlay'><div className = 'button-green'>set up phone to recieve alerts</div></div>
				}else{
					items = <div className='profile-activity-overlay'><h3 className = 'profile-'>no alerts</h3></div>
				}
				
			}
		}else if(this.state.tab == 'favorites'){
			var items = this.props.profile.favorites.map(this.makeFavorite)
			if(!items.length){
				items = <div className='profile-activity-overlay'><h3 className = 'profile-'>your favorite shows will show up here</h3></div>
			}

		}

		if(items.length == []){
			this.state.tab == 'alerts'
		}


		return (
			<div>
				<div className="profile-activity-options">
					<span className = {'profile-activity-option ' + (this.state.tab == 'alerts' ? 'profile-activity-option-active-alerts': '')} onClick = {this.showAlerts} >alerts</span>
					<span className = {'profile-activity-option ' + (this.state.tab == 'favorites' ? 'profile-activity-option-active-favorites' : '')} onClick = {this.showFavorites} >favorites</span>
				</div>
				<div className="profile-activity-items">
					{items}
				</div>
			</div>
		)
	}
})


export default ProfileActivity

