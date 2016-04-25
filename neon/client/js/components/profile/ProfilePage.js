import moment from 'moment';
import React from 'react';
import I from 'intui/source/Slide';
import FavoriteButton from './FavoriteButton';
import AlertButton from './AlertButton';
import IButton from 'intui/source/Button';
import * as op from 'operator';
import ListItemSm from 'components/ListItemSm'


var Profile = React.createClass({

	toShow: function(id){
		window.location.href='/show/'+id
	},
	alertDate: function(d){
		var nd = moment(d);
		return d.toString()
	},
	date_str: ["at time of ","30 minutes","one hour","two hours","a day","two days","a week"],
	alertItem: function(alert,i){

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


	favItem: function(show,i){
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

	toggleNewsLetter: function(){
		op.toggleNewsLetter(!window.user.newsletter).done(()=>{
			window.user.newsletter = !window.user.newsletter
			op.renderPrivateProfile();
		})
	},

	settings: function(){
		op.showProfileSettings()
	},

	showAlerts: function(){
		this.setState({tab_pos:0})
	},

	showFaves: function(){
		this.setState({tab_pos:1})
	},	

	render: function(){
		var self = this.props.profile.is_authenticated != null
		var profile = this.props.profile
		var alerts,favorites,profile_actions;

		var newsletter = null;


		if(self){
			
			newsletter = (
				<div className='profile-actions-newsletter' style = {{background:window.user.newsletter ? '#B2FFE3' : '#59FFAB'}} onClick={this.toggleNewsLetter} >
					<input className = 'profile-actions-newsletter-radio' type="checkbox" onChange = {()=>{}} checked = {window.user.newsletter}/>
					<div>recieve newsletter</div>
				</div>
			)
			
			profile_actions = (
				<I height = {40} c="profile-actions">
					<div onClick={this.logout} className={"profile-actions-button"}>logout</div>
					<div onClick={this.settings} className={"profile-actions-button"}>settings</div>
					{newsletter}
				</I>				
			)
		}




		if(profile.alerts.length == 0){
			alerts = (
				<I vertical center height = {500} >
					<h2>No Alerts</h2>
					{ (self && user.phone == null) ? (<div onClick = {op.showProfileSettings.bind(null,2)} className="button-green">Set up phone alerts</div>) : null }
				</I>
			)
		}else{
			alerts = profile.alerts.map(this.alertItem)			
		}

		if(profile.favorites.length == 0){

			favorites = (
				<I vertical center height = {500}>
	
					<h2>No Favorites</h2>
					{ self ? (<span>add favorites to keep track of shows that you may want to go to</span>) : null }
		
				</I>
			)
		}else{
			favorites = profile.favorites.map(this.favItem)
		}
		
		var name = null;
		if(user.name != null){
			var name = (<span className="profile-info-name">{user.name}</span>)
		}
		

		return (
			<div className="profile">
				{profile_actions}
				<div vertical className="profile-info">
					<div className="profile-info-main">
						<div className="profile-info-pic-wrap" >
							<div onClick={this.settings} className="profile-info-pic" style={{backgroundSize:'cover',backgroundImage: 'url('+(this.props.profile.pic || '/static/showgrid/img/avatar.jpg')+')' }} >
								<div className="profile-info-pic-overlay">
									<svg dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-settings"/>' }} />
								</div>
							</div>
						
						</div>
						<div className="profile-info-bio">
							{name}
							<span className="profile-info-bio-quote-left">&#10077;</span><p className="profile-info-bio-text">{this.props.profile.bio || "this person prefers to have a sense of mystery about them"}</p><span className="profile-info-bio-quote-right">&#10078;</span>
							<span className="profile-info-extra">joined {moment(profile.joined_date).format("MMM Do YYYY")} and was last seen {moment(profile.last_login).calendar()}</span>
						</div>						
					</div>
				</div>
				<div className="profile-activity">
					<I beta={100} vertical>
						<I center height = {50}>
							<I slide index_pos={this.state.tab_pos} vertical beta = {200} c="profile-activity-title">
								<I center>
									<h3>{user.alerts.length} Alert{user.alerts.length != 1 ? 's' : ''} </h3>
								</I>
								<I center>
									<h3>{user.favorites.length} Favorite{user.favorites.length != 1 ? 's' : ''}</h3>
								</I>
							</I>
							<IButton c1 = '#F8F5F2' onClick = {this.showAlerts} active={!this.state.tab_pos} width = {60} inverse down bClassName='profile-activity-option'>
								<svg dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-alert"/>' }} />
							</IButton>
							<IButton c1 = '#F8F5F2' onClick = {this.showFaves} active={this.state.tab_pos} width = {60} inverse down bClassName='profile-activity-option'>
								<svg dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-heart"/>' }} />
							</IButton>
						</I>
						<I slide index_pos = {this.state.tab_pos} outerClassName = "profile-activity-container">
							<I vertical>
								{alerts}
							</I>
							<I vertical>
								{favorites}
							</I>
						</I>
					</I>
				</div>
			</div>
		)
	}
})

export default Profile