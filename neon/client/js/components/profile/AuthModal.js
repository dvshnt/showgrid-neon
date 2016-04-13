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
		console.log("TEST",err)
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
			data: JSON.stringify({email:email,password:password}),
			dataType: 'json',
			success: this.isGood.bind(this,null),
			error: this.isGood.bind(this,"we couldnt log you in, try again.")
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
			error: this.isGood.bind(this,"hmm something went wrong")
		 })
	}

	render(){

		return (
			<Modal className = {'auth-modal'} onClose={op.closeModal} onResetError={this.resetError} error={ this.state.error } visible = {this.props.visible}  page_index = {this.state.isSignUp ? 1 : 0} >
				<I innerClassName = "modal-page-container" vertical beta = {100}>
					

					<I beta={60}>
						<div className = 'auth-banner'/>
					</I>


					<I beta = {120} vertical>
						<p><span><a className="button-green signup-button" href="#" onClick={ this.toggleScreen }>Sign up</a> for Showgrid</span></p>
						<p>Favorite shows, set show alerts, and particpate in all the conversation happening on here!</p>
					</I>


					<I center beta = {50} >
						<input required type="text" ref="email" placeholder="Enter email" onChange={ this.resetError }/>
						<input required type="password" ref="password" placeholder="Enter password" onChange={ this.resetError }/>
					</I>


					<I center innerClassName = "auth-input">
						<input className = "button-blue" type="submit" value="Log In" onClick={ this.userLogin } />
						<b style={{margin:'5px'}}>or</b>
						<AuthButton type="facebook" />
					</I>


					<I center beta ={30}>
						<p className="auth-forgot">Forgot your password? email <a href="mailto:info@showgrid.com?Subject=Password%20RESET" target="_top" ><b>info@showgrid.com</b></a></p>
					</I>

				</I>
				<I innerClassName = "modal-page-container" vertical beta = {100}>
					
					<I beta = {100} center >
						<p>Sign up with your email and a password.</p>
					</I>

					<I beta = {110} vertical center >
						<input required type="email" autoComplete="off" ref="register_email" placeholder="Enter Email" onChange={ this.resetError }/>
						<input required type="password" autoComplete="off" ref="register_password" placeholder="Enter password" onChange={ this.resetError }/>
						<input required type="password" autoComplete="off" ref="register_password2" placeholder="Confirm password" onChange={ this.resetError }/>
						<input className = "button-blue" type="submit" value="Sign Up" onClick={ this.userSignup } />
					</I>

					<I beta = {60} center >
						<span><b><a href="#" onClick={ this.toggleScreen }>Log In</a></b></span>
					</I>
				</I>
			</Modal>
		)
	}
};



