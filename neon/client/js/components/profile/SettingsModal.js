//react based modal to change profile settings, edit alerts and favorite / unfavorite shows.
import ListItemSm from 'components/ListItemSm'
import I from 'intui/source/Slide'
import React, { Component } from 'react';
import Modal from 'components/Modal';
import * as op from 'operator';
import IButton from 'intui/source/Button';




import $ from 'jquery';
import SlideMixin from 'intui/source/Mixin';


var PhoneTab = React.createClass({
	mixins: [SlideMixin],
	getInitialState: function(){
		return {
			page_index: 0,
			focusButton: false			
		}
	},
	
	getDefaultProps: function(){
		return {

		}
	},

	handleKeydown: function(e) {
		// ESC key
		if (e.keyCode == 27){
			e.preventDefault();
			this.hidePhoneModal();
		}
	},

	userSubmitPin: function(e){
		var pin = this.refs.pinOne.value;
			pin += this.refs.pinTwo.value;
			pin += this.refs.pinThree.value;
			pin += this.refs.pinFour.value;


		$.ajax({
			url:'/user/rest/pin_check',
			method:'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-CSRFToken': window.user.csrf
			},
			dataType: 'json',	
			data: JSON.stringify({
				pin:pin
			})
		}).done((dat)=>{
			if(dat.status == 'pin_verified'){
				this.setState({
					page_index: 2
				})
			}else{
				this.props.onError("invalid pin")
			}			
		}).fail(()=>{
			this.props.onError("invalid pin")
		})

	
		e.preventDefault();
		return false
	},

	goToNextPinInput: function(e) {
		var classes = e.target.className;

		if (classes.indexOf("pin-1") > -1) {
			this.refs.pinTwo.focus();
			return true;
		}

		if (classes.indexOf("pin-2") > -1) {
			this.refs.pinThree.focus();
			return true;
		}

		if (classes.indexOf("pin-3") > -1) {
			this.refs.pinFour.focus();
			return true;
		}

		if (classes.indexOf("pin-4") > -1) {
			this.setState({
				focusButton: true
			});
			return true;
		}

		return false;
	},

	userSubmitPhone: function(e) {
		var phonenumber = this.refs.phonenumber.value;
		var _this = this;
		var url = '/user/rest/phone_set';

		$.ajax({
			url:url,
			method:'POST',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-CSRFToken': window.user.csrf
			},
			dataType: 'json',	
			data: JSON.stringify({phone:phonenumber})		
		}).done((dat)=>{
			this.setState({
				page_index: 1,
			});
		}).fail(()=>{
			this.props.onError("oops, try again")
		})
	},

	render: function(){
		if(window.user.phone != null){
			var current_phone = (<h3>change phone : {window.user.phone}</h3>)
		}else{
			var current_phone = <h3>set up a new phone</h3>
		}
		return (
			<I slide index_pos = {this.state.page_index} >
				<I center c= 'profile-settings-phonetab' vertical beta = {100} >
					{current_phone}
					<p>
						To complete the process, you will receive a 4-digit pin at the number you provide. Enter the PIN when prompted to get started receiveing alerts!
					</p>
					<p>
						Text alerts will include a link to buy tickets as well as information about the show.
					</p>
					<form action="" >
						<span> <span><b>+1</b></span> <input className="phone" type="tel" pattern="[0-9]{10}" ref="phonenumber" placeholder="Your 10 Digit Phone #" title="" onChange={ this.resetState }/></span>
						<br></br>
					</form>
					<div onClick={this.userSubmitPhone}className="button-green">submit</div>
				</I>
				<I vertical beta = {100} c= 'profile-settings-phonetab'>
					<I center vertical height = {200} >
						<h3>Confirm your phone number</h3>
						<p>
							Enter the 4-digit PIN you receive to start getting alerts.
						</p>
					</I>
					<I center  height = {150} >
						<input maxLength="1" className="pin pin-1" type="text" ref="pinOne" size="1" onChange={ this.goToNextPinInput }/>
						<input maxLength="1" className="pin pin-2" type="text" ref="pinTwo" size="1" onChange={ this.goToNextPinInput }/>
						<input maxLength="1" className="pin pin-3" type="text" ref="pinThree" size="1" onChange={ this.goToNextPinInput }/>
						<input maxLength="1" className="pin pin-4" type="text" ref="pinFour" size="1" onChange={ this.goToNextPinInput }/>
					</I>
					<I center height = {150}>
						<div className="button-green" onClick={this.userSubmitPin}>submit</div>
					</I>
				</I>
				<I center beta = {100} vertical c= 'profile-settings-phonetab'>
					
					<h3>Phone Number Verified!</h3>
					<p>Set all the alerts you need. We won&#39;t bother you otherwise.</p>

				</I>
			</I>
		)
	}
})














































var SettingsModal = React.createClass({
	mixins: [SlideMixin],

	getInitialState: function(){
		return {
			saving: false,
			tab_pos: this.props.tab_pos,
		}
	},
	
	getDefaultProps: function(){
		return {
			tab_pos: 1,
		}
	},

	componentWillReceiveProps: function(props,state){
		if(props.tab_pos != this.state.tab_pos){
			this.setState({
				tab_pos: props.tab_pos
			})
		}
	},

	updateProfile: function(){
		var data = new FormData();
		data.append('pic', this.refs.input_pic.files[0]);
		data.append('bio', this.refs.input_bio.value);
		data.append('name', this.refs.input_name.value);
		data.append('email', this.refs.input_email.value);
		
		this.setState({
			saving:true,
		})

		$.ajax({
		    url: '/user/update',
		    type: 'POST',
		    data: data,
		    headers: {
				'X-CSRFToken': window.user.csrf
			},
		    enctype: "multipart/form-data",
		    cache: false,
		    dataType: 'json',
		    contentType: false,
		    processData: false,
		    
		}).done((body)=>{
			window.location.reload()
		}).fail((body)=>{
			console.log(body)
			this.setState({
				saving:false,
				error: body.responseJSON ? body.responseJSON.status : "oops something went wrong"
			})			
		})
	},


	clearAlerts: function(){
		if(window.user.alerts == null || window.user.alerts.length == 0){
			return op.closeModal()
		}

		$.ajax({
			url: '/user/rest/alerts',
			type: 'DELETE',
			headers: {'X-CSRFToken': window.user.csrf},
			dataType: 'json',
		}).done(()=>{
			window.user.alerts = [];
			if(window.location.pathname == '/user/profile'){
				op.renderPrivateProfile();
			}
			op.closeModal()
		})
	},



	tryClose: function(){
		if(this.state.error != null){
			this.setState({
				error:null
			})
		}else if(this.state.tab_pos != 1){
			this.setState({
				tab_pos:1
			})
		}else{
			op.closeModal()
		}
	},

	resetState: function(){
		this.setState({
			error: null
		})
	},

	toggleNewsletter: function(){
		op.toggleNewsLetter(!window.user.newsletter)
		.done((dat)=>{
			window.user.newsletter = !window.user.newsletter
			this.forceUpdate();
		})
	},

	render: function(){

		var user = window.user;



		return (
			<Modal onResetError = {this.setState.bind(this,{error:null})} onClose = {this.tryClose} className = {'profile-settings'}  error = {this.state.error} page_index = {this.state.tab_pos} >			
				

				<I vertical>
					<I height = {60} center c='profile-settings-title'>
						<h3>change password</h3>
					</I>
					<I vertical>
						<I center>
							<span className="profile-settings-cat">change password</span>
						</I>
						<I center>
							<input onChange = {this.resetState} ref="current_pass" type="password" placeholder= {"Old Password" } />
						</I>
						<I center>
							<input onChange = {this.resetState} ref="new_pass" type="password" placeholder= {"New Password" } />
						</I>
						<I center>
							<input onChange = {this.resetState} ref="new_pass_confirm" type="password" placeholder= {"Confirm New Password" } />
						</I>
						<I onClick = {this.update} center>
							<div className="button-green">save</div>
						</I>
					</I>
				</I>


				<I vertical beta = {100}>

					<I height = {60} center c='profile-settings-title'>
						<h3>settings</h3>
					</I>


					<I beta = {130} center vertical c="profile-settings-main">
						<form  action = "/user/update" className='profile-settings-form' method="post">
							<input className="profile-settings-input-name" type="text" name="name" ref = "input_name" placeholder = {user.name || "Your Name"}  />
							<I center>
								<div className="profile-settings-pic">
									<img style={{backgroundSize:'cover',backgroundImage: 'url('+(user.pic || '/static/showgrid/img/avatar.gif')+')' }} />
								</div>
								<input className="profile-settings-input-pic" name = "pic" ref = "input_pic" type="file" accept="image/*" />
								
							</I>

							<textarea name = "bio" className="profile-settings-input-bio" maxLength="200" ref="input_bio" onChange={this.resetState} placeholder="Tell us about yourself..." defaultValue={ user.bio }></textarea>
							<div onClick = {this.updateProfile} className="button-green profile-settings-save">{this.state.saving ? "uploading..." : "save profile info"}</div>
						</form>
					</I>
					
				
					<I c="profile-settings-more" vertical>
						<div className= "profile-settings-action" onClick =  {this.setState.bind(this,{tab_pos:0})}>change password</div>
						<div className= "profile-settings-action" onClick =  {this.setState.bind(this,{tab_pos:2})}>change phone</div>
						<div className = 'profile-settings-action' onClick =  {this.setState.bind(this,{tab_pos:3})}>change email</div>
						<div className = {'profile-settings-action profile-settings-newsletter ' + (user.newsletter ? 'profile-settings-action-bad' : '')} onClick = {this.toggleNewsletter}>{user.newsletter ? "cancel newsletter" : "recieve newsletter"}</div>
						<div className = 'profile-settings-action profile-settings-action-bad' onClick =  {this.clearAlerts}>clear all alerts</div>

					</I>
				</I>


				<I vertical>
					<I height = {60} center c='profile-settings-title'>
						<h3>Sign Up to Receive Text Alerts</h3>
					</I>
					<PhoneTab onResetError={this.setState.bind(this,{error:null})} onError={(e)=>{this.setState({error:e})}} />
				</I>

				<I vertical>
					<I height = {60} center c='profile-settings-title'>
						<h3>Change Email</h3>
					</I>
					<I vertical center>
						<input className="profile-settings-input-email" ref = "input_email" placeholder={user.email}/>
						<div onClick = {this.updateProfile} className="button-green profile-settings-save">{this.state.saving ? "uploading..." : "set new email"}</div>
					</I>

				</I>
				
				
			</Modal>
		)
	}
});

export default SettingsModal;

