import React, { Component } from 'react';
import $ from 'jquery';
import FormButton from '../FormButton';
import windowScroll from '../../util/windowScroll';




export default class PhoneModal extends Component {
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
		this.setState({
			visible: false
		})
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




	handleKeydown(e) {
		// ESC key
		if (e.keyCode == 27) {
			e.preventDefault();
			this.hidePhoneModal();
		}
	}

	userSubmitPin(e) {
		var pin = React.findDOMNode(this.refs.pinOne).value;
			pin += React.findDOMNode(this.refs.pinTwo).value;
			pin += React.findDOMNode(this.refs.pinThree).value;
			pin += React.findDOMNode(this.refs.pinFour).value;

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
			.then(function(body) {
				if(body.status == 'pin_verified') {
					React.render(<PhoneModal visible={false} />,document.getElementById('overlay-wrapper'));
				}
				else {
					_this.setState({
						verify: true,
						error: true
					});
				}
			});

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
		.then(function(body) {
			_this.setState({
				verify: true,
				error: false
			});
		});

		// e.preventDefault();
	}

	render() {
		return (
			<Modal onClose={this.hidePhoneModal} visible={this.props.visible} page_index = {page_index} >
				<Slide vertical beta = {100} >
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
				</Slide>
				<Slide vertical beta = {100} >
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
				</Slide>
				<Slide beta = {100} vertical>
					<div>
						<h3>Phone Number Verified!</h3>
						<p>Set all the alerts you need. We won&#39;t bother you otherwise.</p>
					</div>
				</Slide>
			</Modal>
		)		
	}
}
