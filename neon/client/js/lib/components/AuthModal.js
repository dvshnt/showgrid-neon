import React, { Component } from 'react';
var GridEngine = require('../util/GridEngine');
import FormButton from './FormButton';
import windowScroll from '../util/windowScroll';
import classNames from 'classnames';
import $ from 'jquery';



class AuthModal extends Component {
	constructor(props) {
		super(props);

		this.userSignup = this.userSignup.bind(this);
		this.userLogin = this.userLogin.bind(this);
		this.resetError = this.resetError.bind(this);




		this.toggleScreen = this.toggleScreen.bind(this);

		this.state = {
			token: null,
			error: false,
			isSignUp: false,
			facebook_login: false,
			animate: true,
		};
	}

	componentWillReceiveProps(nextProps) {
		//console.log("GOT NEW PROPS",nextProps)

		var top = (window.pageYOffset || window.scrollY)
		var left = (window.pageXOffset || window.scrollX)
		if(top == null || left == null){
			//console.log("BAD SCROLL INPUT")
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
			error: false,
			isSignUp: !this.state.isSignUp
		});
		return false;
	}

	closeModal() {
		// this.setState({
		// 	error: false,
		// 	display: false
		// })
	}


	resetError(e) {
		if (this.state.error) {
			this.setState({
				error: false,
				display: false,
			});
		}
	}

	isGood(err){
		if(err == false){
			window.location.reload()
		}else{
			return this.setState({error: true});
		}
	}

	userSignup(e){
		//console.log("SIGNUP")
		e.preventDefault();

		var email = React.findDOMNode(this.refs.register_email).value;
		var password = React.findDOMNode(this.refs.register_password).value;
		var password2 = React.findDOMNode(this.refs.register_password2).value;

		if(password2 != password) return this.setState({ error:true })
		$.ajax({
			url: '/user/signup',
			type: 'POST',
			data: JSON.stringify({email:email,password:password}),
			dataType: 'json',
			success: this.isGood.bind(this,false),
			fail: this.isGood.bind(this,true)
		})
	}

	userLogin(e) {
		//console.log("SIGNIN")
		e.preventDefault();

		var email = React.findDOMNode(this.refs.email).value;
		var password = React.findDOMNode(this.refs.password).value;

		 $.ajax({
		 	url: '/user/login',
			type: 'POST',
			data: JSON.stringify({email:email,password:password}),
			dataType: 'json',
			success: this.isGood.bind(this,false),
			error: this.isGood.bind(this,true)
		 })
	}

	render() {
		//console.log("RENDER AUTH",this.state)

		var active = classNames({
			"active": this.props.visible,
			"animate" : true
		})

		var container_state= classNames({
			'modalScreenContainer' : true,
			'page2': this.state.isSignUp == true ? true : false 
		})

		//console.log(this.state.scrollLeft,this.state.scrollTop);
		//window.scrollTo(this.state.scrollLeft,this.state.scrollTop);

		return (
			<div id="overlay" className={ active } style={{top: this.state.scrollTop,left: this.state.scrollLeft}}>
				<div id="modal">
					<b id="close" className="icon-close" onClick={ this.closeModal }></b>
					<div className="banner"></div>
					<div className = {container_state}>
						<div className= 'modalScreen' id='LogInModalScreen'>
							<p>
							<span><a className="signup-button" href="#" onClick={ this.toggleScreen }>Sign up</a> for Showgrid</span> 
							</p>
							<p>
								Favorite shows, set show alerts, and particpate in all the conversation happening on here!
							</p>
							<form id = "signin" action="" onSubmit={ this.userLogin }>
								<input required type="text" ref="email" placeholder="Enter email" onChange={ this.resetError }/>
								<input required type="password" ref="password" placeholder="Enter password" onChange={ this.resetError }/>
								<FormButton error={ this.state.error } errorMessage="Invalid email or Password" submitMessage="Sign In" />
							</form>
							<p className="sub">
								Forgot your password? email <a href="mailto:info@showgrid.com?Subject=Password%20RESET" target="_top" ><b>info@showgrid.com</b></a>
							</p>
						</div>
						<div className= 'modalScreen' id='SignUpModalScreen'>
							<p>
								Sign up with your email and a password.
							</p>
							<form id = "signup" action="" onSubmit={ this.userSignup }>
								<input required type="email" autoComplete="off" ref="register_email" placeholder="Enter Email" onChange={ this.resetError }/>
								<input required type="password" autoComplete="off" ref="register_password" placeholder="Enter password" onChange={ this.resetError }/>
								<input required type="password" autoComplete="off" ref="register_password2" placeholder="Confirm password" onChange={ this.resetError }/>
								<FormButton error = { this.state.error } errorMessage="hm...try again" submitMessage="Sign Up" />

							</form>
							<br/>
							<span><b><a href="#" onClick={ this.toggleScreen }>Log In</a></b></span>
						</div>
					</div>
				</div>
			</div>
		)

	}
};


export default AuthModal
