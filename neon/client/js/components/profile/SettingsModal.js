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
		if (e.keyCode == 13){
			switch(this.state.page_index){
				case 0:
					this.userSubmitPhone(e);
					break;
				case 1:
					this.userSubmitPin(e);
					break;
			}
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
			window.user.phone = phonenumber;
			this.setState({
				page_index: 1,
			});
		}).fail(()=>{
			this.props.onError("oops, try again")
		})
	},

	removePhone: function(e){
	
		var _this = this;
		var url = '/user/rest/phone_set';

		$.ajax({
			url:url,
			method:'DELETE',
			headers: {
				'Accept': 'application/json',
				'Content-Type': 'application/json',
				'X-CSRFToken': window.user.csrf
			},
		}).done((dat)=>{
			window.user.phone = null;
			this.forceUpdate();
		}).fail(()=>{
			this.props.onError("oops, try again")
		})
	},

	render: function(){
		if(window.user.phone != null){
			var current_phone = (<h3>change phone : {window.user.phone}</h3>)
			var delete_phone = <div className="button-red" onClick ={this.removePhone} >Remove Phone</div>
		}else{
			var current_phone = <h3>Set up a New Phone</h3>
			var delete_phone = null
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
					<div onClick={this.userSubmitPhone}className="button-green">Submit</div>
					{delete_phone}
				</I>
				<I vertical beta = {100} c= 'profile-settings-phonetab'>
					<I center vertical height = {100} >
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
					
						<div className="button-green" onClick={this.userSubmitPin}>Submit</div>
						
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
			home: this.props.tab_pos != 0 ? false : true,
		}
	},
	
	getDefaultProps: function(){
		return {
			tab_pos: 0,
		}
	},

	onKeyPress: function(e){
		if(e.keyCode == 13){
			switch(this.state.tab_pos){
				case 2:
					this.refs.phone_tab.handleKeydown(e)
					break
				case 1:
					this.updatePassword(e)
				case 0:
				case 3:
					this.updateProfile(e)
					break
			}
		}
	},

	componentDidMount: function(){
		document.addEventListener("keydown", this.onKeyPress.bind(this), false);
		if(this.props.tab_pos != 0){
			this.setState({
				home:false
			})
		}
	},

	componentWillUnmount: function(){
		document.removeEventListener("keydown", this.onKeyPress.bind(this), false);
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
		data.append('pic', this.refs.input_pic ? this.refs.input_pic.files[0] : null);
		data.append('bio', this.refs.input_bio ? this.refs.input_bio.value : null);
		data.append('name', this.refs.input_name ? this.refs.input_name.value : null);
		data.append('email', this.refs.input_email ? this.refs.input_email.value : null);
		
		this.setState({
			saving:true,
		})

		$.ajax({
		    url: '/user/update',
		    method: 'POST',
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

	updatePassword: function(){
		



		if(this.refs.new_pass.value != this.refs.new_pass_confirm.value){
			return this.setState({
				error: 'passwords dont match'
			})
		}else if(this.refs.current_pass.value == null){
			return this.setState({
				error: 'enter your password'
			})
		}


		$.ajax({
		    url: '/user/update_pass?current_pass='+this.refs.current_pass.value+'&new_pass='+this.refs.new_pass.value,
		    method: 'POST',
		    headers: {'X-CSRFToken': window.user.csrf},
		}).done(()=>{
			window.location.href = "/?q=profile"
		}).fail((body)=>{
			this.setState({
				saving:false,
				error: body.responseJSON ? body.responseJSON.status : "oops something went wrong"
			})			
		})
	},


	clearAlerts: function(){
		if(window.user.alerts == null || window.user.alerts.length == 0){
			return 
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
		}else if(this.state.home == false){
			this.setState({
				home:true
			})
		}else{
			op.closeModal()
		}
	},

	showTab: function(pos){
		this.setState({
			home: false,
			tab_pos: pos
		})
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


		if(this.state.tab_pos == 1){
			var page =  (
				<I vertical>
					<I height = {60} center c='profile-settings-title'>
						<h3>change password</h3>
					</I>
					<I vertical c = 'profile-settings-passwordtab'>
						<I center>
							<input onChange = {this.resetState} ref="current_pass" type="password" placeholder= {"Old Password" } />
						</I>
						<I center>
							<input onChange = {this.resetState} ref="new_pass" type="password" placeholder= {"New Password" } />
						</I>
						<I center>
							<input onChange = {this.resetState} ref="new_pass_confirm" type="password" placeholder= {"Confirm New Password" } />
						</I>
						<I onClick = {this.updatePassword} center>
							<div className="button-green">save</div>
						</I>
					</I>
				</I>
			)
		}else if(this.state.tab_pos == 2){
			var page = (
				<I vertical>
					<I height = {60} center c='profile-settings-title'>
						<h3>Receive Text Alerts</h3>
					</I>
					<PhoneTab ref = 'phone_tab' onResetError={this.setState.bind(this,{error:null})} onError={(e)=>{this.setState({error:e})}} />
				</I>
			)
		}else if(this.state.tab_pos == 3){
			var page = (
				<I  vertical>
					<I height = {60} center c='profile-settings-title'>
						<h3>Change Email</h3>
					</I>
					<I vertical center>
						<input className="profile-settings-input-email" ref = "input_email" placeholder={user.email}/>
						<div onClick = {this.updateProfile} className="button-green profile-settings-save">{this.state.saving ? "uploading..." : "set new email"}</div>
					</I>

				</I>
			)
		}
		

		return (
			<Modal onResetError = {this.setState.bind(this,{error:null})} onClose = {this.tryClose} className = {'profile-settings'}  error = {this.state.error} page_index = {this.state.home ? 0 : 1} >			
				<I vertical beta = {100}>

					<I height = {60} center c='profile-settings-title'>
						<h3>settings</h3>
					</I>
					<div className='profile-settings-tab-options'>
						<div className='profile-settings-tab-option' onClick = {this.showTab.bind(this,3)} >
							<svg dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-mail"/>' }} />
							<span>{user.email}</span>
						</div>
						<div className='profile-settings-tab-option' onClick = {this.showTab.bind(this,2)} >
							<svg dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-phone"/>' }} />
							<span>{user.phone == null ? "set up phone" : user.phone}</span>
						</div>
						<div onClick = {this.showTab.bind(this,1)} className='profile-settings-tab-option' >
							<svg dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-lock"/>' }} />
							<span>change password</span>
						</div>
					</div>

					<I c="profile-settings-main" beta = {80}>
						<I vertical beta = {20} c="profile-settings-input-types">
							<span>name</span>
							<span>picture</span>
							<span>bio</span>
						</I>
						<I vertical beta = {80} c="profile-settings-input-form">
							<input className="profile-settings-input-name" type="text" name="name" ref = "input_name" placeholder = {user.name || "Your Name"}  />
							<I height = {60} >
								<div className="profile-settings-pic">
									<img style={{backgroundSize:'cover',backgroundImage: 'url('+(user.pic || '/static/showgrid/img/avatar.jpg')+')' }} />
								</div>
								<input onChange={this.onDrop} className="profile-settings-input-pic" ref = "input_pic" type="file" accept="image/*" />
							</I>

							<textarea name = "bio" className="profile-settings-input-bio" maxLength="200" ref="input_bio" onChange={this.resetState} placeholder="Tell us about yourself..." defaultValue={ user.bio }></textarea>
							
							
						</I>
						
					</I>
					<I center height = {120}>
						<div onClick = {this.updateProfile} className="button-green profile-settings-save">{this.state.saving ? "uploading..." : "save profile info"}</div>
					</I>
				</I>
				<I>
					{page}
				</I>
			</Modal>
		)
	}
});

export default SettingsModal;

