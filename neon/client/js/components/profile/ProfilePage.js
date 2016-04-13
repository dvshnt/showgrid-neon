import moment from 'moment';
import React from 'react';
import I from 'intui/source/Slide';
import FavoriteButton from './FavoriteButton';
import AlertButton from './AlertButton';
import IButton from 'intui/source/Button';
import * as op from 'operator';



var Profile = React.createClass({

	getDefaultProps: function(){
		return {
			profile: null
		}
	},

	getInitialState: function(){
		return {
			tab_pos: 0,
			show_favorites: false
		}
	},

	//action bar
	logout: function(){
		window.location.href = '/user/logout'
	},

	newsletter: function(toggle){
		op.toggleNewsLetter(toggle)
	},

	settings: function(){
		op.showProfileSettings()
	},

	render: function(){
		var self = this.props.profile.is_authenticated != null
		var profile = this.props.profile
		var alerts,favorites,profile_actions;



		if(self){
			profile_actions = (
				<I height = {70} c="profile-actions">
					<div onClick={this.settings} className={"profile-actions-button"}>settings</div>
					<div onClick={this.logout} className={"profile-actions-button"}>logout</div>
					<div className={"profile-actions-button"}>signup for the newsletter</div>
				</I>				
			)
		}




		if(profile.alerts.length == 0){
			alerts = (
				<I vertical center height = {500} >
					<h2>No Alerts</h2>
					{ self ? (<div onClick = {op.showProfileSettings.bind(null,2)} className="button-green">Set up phone alerts</div>) : null }
				</I>
			)
		}else{
			alerts = profile.alerts.map((alert,i)=>{
				return (
					<I height = {120} c={'profile-alert'} key={"profile_alert_"+i} style={{'background': i%2 ? '#F1F1F1' : '#F9F9F9'}} >
						<I c={'profile-alert-info'}>
							<I c={'profile-alert-info'}>
								<a href = {"/show/"+alert.show.id}> {alert.show.headliners} </a>
								<a href = {"/show/"+alert.show.id}> {alert.show.openers} </a>
							</I>
						</I>
						<I center width = {120} c={'profile-alert-icon'} style={{'background': i%2 ? '#515151' : '#3E3E3E'}}>
							<AlertButton show={alert.show} />
						</I>
					</I>
				)
			})			
		}

		if(profile.favorites.length == 0){
			favorites = (
				<I vertical center height = {500}>
	
					<h2>No Favorites</h2>
					{ self ? (<span>add favorites to keep track of shows that you may want to go to</span>) : null }
		
				</I>
			)
		}else{
			 favorites = profile.favorites.map((show,i)=>{
				return (
					<div className={'profile-favorite'} height = {100} center key={"profile_fav_"+i}>
						<a href = {"/show/"+show.id}>{show.headliners} with {show.openers}</a>
						<AlertButton show={show} />
						<FavoriteButton show={show} />
					</div>
				)
			})
		}
		


		return (
			<I c="profile" vertical >
				<I c="profile-info" vertical beta={20}>
					<I height = {200}>
						<I beta={100} vertical >
							<I center beta = {200} c="profile-info-main">
								<img className="profile-info-pic" src={this.props.profile.pic || '/static/showgrid/img/avatar.gif'} />
								<div className="profile-info-bio">
									<span className="profile-info-bio-quote-left">&#10077;</span><p className="profile-info-bio-text">{this.props.profile.bio || "this person prefers to have a sense of mystery about them"}</p><span className="profile-info-bio-quote-right">&#10078;</span>
								</div>
							</I>
							<I beta = {50} center c="profile-info-extra" >
								<span className="profile-info-extra-joined">joined : {moment(profile.joined_date).format("MMM Do YYYY")}</span>
								<span className="profile-info-extra-logged">last seen : {moment(profile.last_login).calendar()}</span>
								<span className="profile-info-extra-counter">{profile.alerts.length} alerts and {profile.favorites.length} favorites</span>
							</I>
						</I>
					</I>
					
					{profile_actions}
				</I>
				<I c="profile-activity" beta={80} vertical>
					<I center height = {50}>
						<I slide index_pos={this.state.tab_pos} vertical beta = {200} c="profile-activity-title">
							<I center>
								<h3>Alerts</h3>
							</I>
							<I center>
								<h3>Favorites</h3>
							</I>
						</I>
						<IButton onClick = {this.setState.bind(this,{tab_pos:0})} active={!this.state.tab_pos} width = {60} inverse down bClassName='profile-activity-option'>
							<svg dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-alert"/>' }} />
						</IButton>
						<IButton onClick = {this.setState.bind(this,{tab_pos:1})} active={this.state.tab_pos} width = {60} inverse down bClassName='profile-activity-option'>
							<svg dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-heart"/>' }} />
						</IButton>
						
					</I>
					<I slide index_pos = {this.state.tab_pos}>
						<I vertical>
							{alerts}
						</I>
						<I vertical>
							{favorites}
						</I>
					</I>
					
				</I>
			</I>
		)
	}
})

export default Profile