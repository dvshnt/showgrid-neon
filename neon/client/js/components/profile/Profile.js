import moment from 'moment';
import React from 'react';
import I from 'intui/Slide';
import SetFavorite from '/components/profile/SetFavorite';





var Profile = React.createClass({

	getDefaultProps: function(){
		return {
			self: true,
			profile: null
		}
	},

	getInitialState: function(){
		return {
			show_favorites: false
		}
	},

	//action bar
	logout: function(){
		window.href.location = '/user/logout'
	},

	newsletter: function(toggle){
		op.toggleNewsLetter(toggle)
	},

	settings: function(){
		op.showProfileSettings()
	},

	render: function(){
		var self = this.props.self
		var profile = this.props.profile



		if(self){
			var profile_actions = (
				<I c="profile-actions">
					<I vertical slide index_pos = {profile.newsletter ? 1 : 0}>
						<I onClick={this.newsletter.bind(this,true)} center c="profile-actions-option-enable">
							<div className="profile-actions-option">recieve the newsletter</div>
						</I>
						<I onClick={this.newsletter.bind(this,false)} center c="profile-actions-option-disable">
							<div className="profile-actions-option">stop the newsletter</div>
						</I>
					</I>
					<I onClick={this.settings} center>
						<div className="profile-actions-option">settings</div>
					</I>
					<I onClick={this.logout} center c = "profile-actions-option-logout">
						<div className="profile-actions-option">logout</div>
					</I>
				</I>				
			)
		}else{
			var profile_actions = null
		}



		var profile_info = (

		)

		var alerts = null
		var favorites = null

		if(self){
			if(profile.alerts.length == 0 && self){
				alerts = (
					<I vertical center>
						<h2>No Alerts set</h2><p>Set phone alerts for shows that you want to go</p>
					</I>
				)
			}else{
				 alerts = profile.alerts.map((alert,i)=>{
					return (
						<I height = {100} center key={"profile_alert_"+i}>
							<a href = {"/show/"+show.id}>{show.headliners} with {show.openers}</a>
							<SetAlert show={alert.show} />
						</I>
					)
				})
			}
		}


		if(profile.favorites.length == 0){
			favorites = (
				<I vertical center>
					<h2>No Favorites</h2>
					{ self ? (<p>Set phone alerts for shows that you want to go</p>) : null }
				</I>
			)
		}else{
			 favorites = profile.favorites.map((show,i)=>{
				return (
					<I height = {100} center key={"profile_fav_"+i}>
						<a href = {"/show/"+show.id}>{show.headliners} with {show.openers}</a>
						<SetAlert show={show} />
						<SetFavorite show={show} />
					</I>
				)
			})
		}


		return (
			<I c="profile" vertical scroll>
				{profile_actions}
				<I c="profile-info">
					<I beta={20} center c="profile-info-pic">
						<img src={this.props.profile.pic || '/showgrid/img/avatar.gif'}>
					</I>
					<I beta={100} vertical >
						<I beta = {150} c="profile-info-bio">
							<span className="profile-info-bio-quote">&quot;</span><p className="profile-info-bio-text">{this.props.profile.bio}</p><span className="profile-info-bio-quote">&quot;</span>
						</I>
						<I beta = {100} c="profile-info-extra" center>
							<span className="profile-info-extra-joined">joined : {moment(profile.joined_date).format("MMM Do YYYY")}</span>
							<span className="profile-info-extra-logged">last seen : {moment(profile.last_login).calendar()}</span>
							<span className="profile-info-extra-counter">{profile.alerts.length} alerts and {profile.favorites.length} favorites</span>
						</I>
					</I>
				</I>
				<I slide c="profile-activity-content">
					{alerts}
					{favorites}
				</I>
			</I>
		)
	}
})

export default Profile