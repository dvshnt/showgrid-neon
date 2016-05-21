import React, { Component } from 'react';
import dom from 'react-dom';
var GridEngine = require('util/GridEngine');
import FormButton from 'components/FormButton';
import windowScroll from 'util/windowScroll';
import classNames from 'classnames';
import $ from 'jquery';
import I from 'intui/source/Slide';
import Modal from 'components/Modal';
import * as op from 'operator';
import AuthButton from './AuthButton';



export default class AuthModal extends Component {
	


	constructor(props) {
		super(props);

		this.userSignup = this.userSignup.bind(this);
		this.userLogin = this.userLogin.bind(this);
		this.resetError = this.resetError.bind(this);
		this.toggleScreen = this.toggleScreen.bind(this);

		this.state = {
			hidden:false,
			token: null,
			error: null,
			isSignUp: false,
			facebook_login: false,
			animate: true,
		}
	}

	onKeyPress(e){
		console.log(e.keyCode)
		if(e.keyCode == 13){
			if(this.state.isSignUp) this.userSignup(e);
			else this.userLogin(e);
		}
	}

	componentDidMount(){
		document.addEventListener("keydown", this.onKeyPress.bind(this), false);
	}

	componentWillUnmount(){
		document.removeEventListener("keydown", this.onKeyPress.bind(this), false);
	}

	componentWillReceiveProps(nextProps) {
		//console.log("GOT NEW PROPS",nextProps)

		var top = (window.pageYOffset || window.scrollY)
		var left = (window.pageXOffset || window.scrollX)

		if(top == null || left == null){
			window.scrollTo(0,0)
		}

		if( !nextProps.visible){
			windowScroll.enable();
		}else{
			windowScroll.disable();
		}

		var pagemode = this.state.isSignUp
		if(nextProps.mode == null){
			pagemode = this.state.isSignUp
		}else{
			pagemode = (nextProps.mode == "signup") ? true : false
		}

		this.setState({
			scrollTop: top || 0,
			scrollLeft: left || 0,
			isSignUp: pagemode
		});
	}

	componentDidUpdate(prevProps, prevState) {
		window.scrollTo(this.state.scrollLeft,this.state.scrollTop);
	}

	toggleScreen(e){
		this.setState({
			error: null,
			isSignUp: !this.state.isSignUp
		});
		e.preventDefault()
	}

	resetError(e){
		this.setState({
			error: null,
		});
	}

	isGood(err){
		if(err == null){
			window.location.reload()
		}else{
			return this.setState({
				error: err
			});
		}
	}

	userSignup(e){
		
		e.preventDefault();

		var email = this.refs.register_email.value;
		var password = this.refs.register_password.value;
		var password2 = this.refs.register_password2.value;

		if(password2 != password) return this.setState({ error:true })
		$.ajax({
			url: '/user/signup',
			type: 'POST',
			data: {email:email,password:password},
			dataType: 'json',
			success: this.isGood.bind(this,null),
			error: this.isGood.bind(this,"We couldnt log you in, try again.")
		})
	}

	userLogin(e){
	
		e.preventDefault();

		var email = this.refs.email.value;
		var password = this.refs.password.value;

		 $.ajax({
		 	url: '/user/login?email='+email+'&password='+password,
			type: 'POST',
			dataType: 'json',
			success: this.isGood.bind(this,null),
			error: this.isGood.bind(this,"invalid username or password")
		 })
	}

	tryClose(){
		if(this.state.isSignUp == true){
			this.setState({
				isSignUp: false
			})
		}else{
			op.closeModal();
		}
	}

	render(){

		return (
			<Modal className = {'auth-modal'} onClose={this.tryClose.bind(this)} onResetError={this.resetError} error={ this.state.error } visible = {this.props.visible}  page_index = {this.state.isSignUp ? 1 : 0} >
				<I innerClassName = "modal-page-container" vertical beta = {100}>
					

					<I height={80}>
						<div className = 'auth-banner'/>
					</I>


					<I center beta= {50} vertical>
						<form className = "auth-input-form">
							<input required type="text" ref="email" placeholder="Enter email" />
							<input required type="password" ref="password" placeholder="Enter password" />
							<input className = "button-green" type="submit" value="Log In" onClick={ this.userLogin } />
							<AuthButton type="facebook" />
						</form>
					</I>


					<I height = {50} vertical center>
						<p><span><a className="link" href="#" onClick={ this.toggleScreen }>Sign up</a> for Showgrid</span></p>
					</I>


					<I center height ={80}>
						<p className="auth-forgot">Forgot your password? Email <a className="link" href="mailto:info@showgrid.com?Subject=Password%20RESET" target="_top" ><b>info@showgrid.com</b></a></p>
					</I>

				</I>
				<I innerClassName = "modal-page-container" vertical beta = {100}>
					
					<I height = {50} center >
						<p>Sign up with your email and a password.</p>
					</I>

					<I height = {220} vertical center >
						<div className="signup">
							<input required type="email" autoComplete="off" ref="register_email" placeholder="Enter Email" />
							<input required type="password" autoComplete="off" ref="register_password" placeholder="Enter password" />
							<input required type="password" autoComplete="off" ref="register_password2" placeholder="Confirm password" />
							<input className = "button-green" type="submit" value="Sign Up" onClick={ this.userSignup } />
						</div>
					</I>

					<I height = {40} center >
						<span><b><a className="link" href="#" onClick={ this.toggleScreen }>Log In</a></b></span>
					</I>
				</I>
			</Modal>
		)
	}
};



