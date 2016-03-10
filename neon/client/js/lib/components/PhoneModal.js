import React, { Component } from 'react';
import $ from 'jquery';
import FormButton from './FormButton';
import windowScroll from '../util/windowScroll';




class PhoneModal extends Component {
	constructor(props) {
		super(props);

		this.goToNextPinInput = this.goToNextPinInput.bind(this);
		this.userSubmitPhone = this.userSubmitPhone.bind(this);
		this.userSubmitPin = this.userSubmitPin.bind(this);
		this.handleKeydown = this.handleKeydown.bind(this);
		this.closeOnClick = this.closeOnClick.bind(this);
		this.resetState = this.resetState.bind(this);

		this.state = {
			error: false,
			verify: false,
			success: false,
			focusButton: false
		};
	}


	hidePhoneModal(){
		React.render(<PhoneModal visible={false} />,document.getElementById('overlay-wrapper'));
	}


	resetState(){
		this.setState({
			error: false
		});
	}

	componentWillUpdate(nextProps, nextState) {
		if (nextProps.visible) {
			windowScroll.disable();
			return;
		}
		
		windowScroll.enable();
	}





	closeOnClick(e) {
		if (e.target.id === "overlay") {
			this.hidePhoneModal();
		}
		e.preventDefault()
	}

	handleKeydown(e) {
		// ESC key
		if (e.keyCode == 27) {
			e.preventDefault();
			this.hidePhoneModal();
		}
	}

	userSubmitPin(e) {
		
		// $.ajaxSetup({ 
		// 	beforeSend: function(xhr, settings) {
		// 	function getCookie(name) {
		// 	var cookieValue = null;
		// 	if (document.cookie && document.cookie != '') {
		// 	var cookies = document.cookie.split(';');
		// 	for (var i = 0; i < cookies.length; i++) {
		// 	var cookie = $.trim(cookies[i]);
		// 	// Does this cookie string begin with the name we want?
		// 	if (cookie.substring(0, name.length + 1) == (name + '=')) {
		// 	cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
		// 	break;
		// 	}
		// 	}
		// 	}
		// 	return cookieValue;
		// 	}
		// 	if (!(/^http:.*/.test(settings.url) || /^https:.*/.test(settings.url))) {
		// 	// Only send the token to relative URLs i.e. locally.
		// 	xhr.setRequestHeader("X-CSRFToken", getCookie('csrftoken'));
		// 	}
		// 	} 
		// });

				var pin = React.findDOMNode(this.refs.pinOne).value;
		pin += React.findDOMNode(this.refs.pinTwo).value;
		pin += React.findDOMNode(this.refs.pinThree).value;
		pin += React.findDOMNode(this.refs.pinFour).value;

		var _this = this;
		// this.props.submitPhonePin(pin)
		// 	.then(function(data) {
		// 		if (data.payload.status === "pin_verified") {
		// 			_this.setState({
		// 				verify: false,
		// 				success: true
		// 			});
		// 		}

		// 		else {
		// 			_this.setState({
		// 				error: true
		// 			});
		// 		}
		// 	});

		console.log("SUBMIT PIN",pin)
		$.ajax({
			url: '/user/rest/pin_check',
			type: 'POST',
			data: JSON.stringify({pin:pin}),
			dataType: 'json',
			success: function(e){
				if(e.status == 'pin_verified'){
					React.render(<PhoneModal visible={false} />,document.getElementById('overlay-wrapper'));
				}else{
					_this.setState({
						verify: true,
						error: true
					});
				}
			},
			error: function(){
				_this.setState({
					error: true
				})
			}
		})
		e.preventDefault();
		return false
	}

	goToNextPinInput(e) {
		var classes = e.target.className;

		if (classes.indexOf("pin-1") > -1) {
			React.findDOMNode(this.refs.pinTwo).focus();
			return true;
		}

		if (classes.indexOf("pin-2") > -1) {
			React.findDOMNode(this.refs.pinThree).focus();
			return true;
		}

		if (classes.indexOf("pin-3") > -1) {
			React.findDOMNode(this.refs.pinFour).focus();
			return true;
		}

		if (classes.indexOf("pin-4") > -1) {
			this.setState({
				focusButton: true
			});

			return true;
		}

		return false;
	}

	userSubmitPhone(e) {
		console.log("TEST")
	
		
		var phonenumber = React.findDOMNode(this.refs.phonenumber).value;

		var _this = this;

		$.ajax({
			url: '/user/rest/phone_set',
			type: 'POST',
			data: JSON.stringify({phone:phonenumber}),
			dataType: 'json',
			success: function(e){
				console.log("PHONE SET",e)
				_this.setState({
					verify: true,
					error: false
				});
			},
			error: function(e){
				_this.setState({
					error: true
				})
			}
		})

		// e.preventDefault();
	}

	render() {
		window.modal = this
		console.log("RENDER",this.props.visible)
		var active = (this.props.visible) ? "active" : "";
		var form = null

		
		form = (
			<div key = 'pin-form'>
				<h3>Confirm your phone number</h3>
				<p>
					Enter the 4-digit PIN you receive to start getting alerts.
				</p>
				<form action="" >
					<input maxLength="1" className="pin pin-1" type="text" ref="pinOne" size="1" onChange={ this.goToNextPinInput }/>
					<input maxLength="1" className="pin pin-2" type="text" ref="pinTwo" size="1" onChange={ this.goToNextPinInput }/>
					<input maxLength="1" className="pin pin-3" type="text" ref="pinThree" size="1" onChange={ this.goToNextPinInput }/>
					<input maxLength="1" className="pin pin-4" type="text" ref="pinFour" size="1" onChange={ this.goToNextPinInput }/>
					<br></br>
					<FormButton onClick={this.userSubmitPin} error={ this.state.error } errorMessage="Invalid PIN" submitMessage="Submit" />
				</form>
			</div>
		);
		if (!this.state.verify) {
			form = (
				<div>
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
						<FormButton onClick={this.userSubmitPhone} error={ this.state.error } errorMessage="Invalid Phone Number" submitMessage="Submit"/>
					</form>
				</div>
			);
		}

		if (this.state.success) {
			var _this = this;

			form = (
				<div>
					<h3>Phone Number Verified!</h3>
					<p>Set all the alerts you need. We won&#39;t bother you otherwise.</p>
				</div>
			);

			setTimeout(function() {
				_this.hidePhoneModal();
			}, 800);
		}

		return (
			<div id="overlay" onClick={this.closeOnClick} className={ active } style = {{top: window.scrollY+'px'}}>
				<div id="modal"><b id="close" className="icon-close" onClick={ this.hidePhoneModal }></b>{ form }</div>
			</div>
		)
	}
};





export default PhoneModal
