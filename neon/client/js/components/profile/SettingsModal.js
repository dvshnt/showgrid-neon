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

		var _this = this;
		var url = '/user/rest/pin_check';

		window.fetch(url, {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-CSRFToken': $("input[name=csrfmiddlewaretoken]").val()
			},
			body: JSON.stringify({
				pin:pin
			})
		})
		.then(function(response) {
			return response.json();
		})
		.then((body)=>{
			if(body.status == 'pin_verified'){
				this.setState({
					page_index: 2
				})
				
			}else{
				this.props.onError("invalid pin")
			}
		})
		.catch((e)=>{
			this.props.onError(e)
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
		var phonenumber = React.findDOMNode(this.refs.phonenumber).value;
		var _this = this;
		var url = '/user/rest/phone_set';

		window.fetch(url, {
			method: 'post',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-CSRFToken': $("input[name=csrfmiddlewaretoken]").val()
			},
			body: JSON.stringify({
				phone:phonenumber
			})
		})
		.then(function(response) {
			return response.json();
		})
		.then((body)=>{
			this.setState({
				page_index: 1,
			});
		})
		.catch((e)=>{
			this.props.onError(e)
		})
	},

	render: function(){
		return (
			<I slide index_pos = {this.state.page_index} >
				<I center vertical beta = {100} >
					<h3>Sign Up to Receive Text Alerts</h3>
					<p>
						To complete the process, you will receive a 4-digit pin at the number you provide. Enter the PIN when prompted to get started receiveing alerts!
					</p>
					<p>
						Text alerts will include a link to buy tickets as well as information about the show.
					</p>
					<form action="" >
						<span> <span><b>+1</b></span> <input className="phone" type="tel" pattern="[0-9]{10}" ref="phonenumber" placeholder="Your 10 Digit Phone #" title="" onChange={ this.resetState }/></span>
						<br></br>
						<div onClick={this.userSubmitPhone} error={ this.state.error } errorMessage="Invalid Phone Number" submitMessage="Submit"/>
					</form>
				</I>
				<I vertical beta = {100} >
					<I center vertical>
						<h3>Confirm your phone number</h3>
						<p>
							Enter the 4-digit PIN you receive to start getting alerts.
						</p>
					</I>
					<I center>
						<input maxLength="1" className="pin pin-1" type="text" ref="pinOne" size="1" onChange={ this.goToNextPinInput }/>
						<input maxLength="1" className="pin pin-2" type="text" ref="pinTwo" size="1" onChange={ this.goToNextPinInput }/>
						<input maxLength="1" className="pin pin-3" type="text" ref="pinThree" size="1" onChange={ this.goToNextPinInput }/>
						<input maxLength="1" className="pin pin-4" type="text" ref="pinFour" size="1" onChange={ this.goToNextPinInput }/>
					</I>
					<I onClick={this.userSubmitPin}>
						<div className="button-green">submit</div>
					</I>
				</I>
				<I beta = {100} vertical>
					<div>
						<h3>Phone Number Verified!</h3>
						<p>Set all the alerts you need. We won&#39;t bother you otherwise.</p>
					</div>
				</I>
			</I>
		)
	}
})














































var SettingsModal = React.createClass({
	mixins: [SlideMixin],

	getInitialState: function(){
		return {
			loading: false,
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

	update_pic: function(){



		this.setState({
			loading: true,
		})



		window.fetch('/user/rest/profile-pic',{
			method: 'put',
			headers: {
				'Accept': 'application/json','Content-Type': 'application/json','X-CSRFToken': $("input[name=csrfmiddlewaretoken]").val()
			},
		})
		.then((res)=>{
			window.user = profile;
			op.showSettingsModal();
		})
		.catch((e)=>{
			this.setState({
				loading: false,
				error: 'update failed'
			})
    	})

	},

	update: function(){

		var user = {
			name : this.refs.name.value,
			email : this.refs.email.value,
			bio: this.refs.bio.value,
		}
		

		if( user.name == user.email){
			return this.setState({
				error: "nothing to save",
			})
		}else if(user.new_pass != user.new_pass_confirm){
			return this.setState({
				error: "passwords dont match",
			})		
		}

		this.setState({
			loading: true,
		})

		window.fetch('/user/rest/profile',{
			method: 'put',
			headers: {
				'Accept': 'application/json','Content-Type': 'application/json','X-CSRFToken': $("input[name=csrfmiddlewaretoken]").val()
			},
			body: JSON.stringify(user)
		}).then(function(user){
			window.user = profile;
			op.closeModal();
		}).catch(()=>{
      	 	this.setState({
      	 		loading: false,
      	 		error: 'update failed'
      	 	})
    	});
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

	render: function(){

		var user = window.user;



		return (
			<Modal onClose = {this.tryClose} className = {'profile-settings'}  error = {this.state.error} page_index = {this.state.tab_pos} >			
				

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


				<I vertical beta = {100} c = 'profile-settings-main'>

					<I height = {60} center c='profile-settings-title'>
						<h3>settings</h3>
					</I>


					<I center c="profile-settings-picture">
						<span className="profile-settings-cat" >profile picture</span>
						<img src={user.pic || '/static/showgrid/img/avatar.gif'} />
						<div className="profile-settings-picture-upload">upload</div>
					</I>
					
					<I center c="profile-settings-bio">
						<span className="profile-settings-cat" >profile bio</span>
						<textarea maxLength="200" ref="bio" onChange={this.resetState} placeholder="Tell us about yourself...">{ user.bio }</textarea>
					</I>
					

					<I c="profile-settings-more">
						<div onClick =  {this.setState.bind(this,{tab_pos:0})}>change password</div>
						<div onClick =  {this.setState.bind(this,{tab_pos:2})}>change phone</div>
						<span className="profile-settings-cat" >more options</span>
						<I center onClick = {this.deleteAccout}>
							<div c = 'profile-settings-action'>delete account</div>
						</I>
						<I center onClick = {this.disableAlerts}>
							<div c = 'profile-settings-action'>disable all alerts</div>
						</I>
						<I center onClick = {this.clearAlerts}>
							<div c = 'profile-settings-action'>clear all alerts</div>
						</I>
					</I>
				</I>


				<I vertical>
					<I height = {60} center c='profile-settings-title'>
						<h3>Sign Up to Receive Text Alerts</h3>
					</I>
					<PhoneTab onResetError={this.setState.bind(this,{error:null})} onError={(e)=>{this.setState({error:e})}} />
				</I>
				
				
			</Modal>
		)
	}
});
export default SettingsModal

