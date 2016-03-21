import React, { Component } from 'react';


export default class Share extends Component {
	constructor(props) {
		super(props);

		this.generateFacebookButton = this.generateFacebookButton.bind(this);
		this.generateTwitterButton = this.generateTwitterButton.bind(this);
	}

	generateTwitterButton(show) {
		var shareTwitter = function(e) {
			e.preventDefault();

			var popUp = window.open(
				'http://twitter.com/intent/tweet?text=\'[Page Title]\' via @[handle] - [url]',
				'popupwindow',
				'scrollbars=yes,width=800,height=400'
			);

			popUp.focus();
			return false;
		};

		return (
			<a className="twitter" href="#" onClick={ shareTwitter }>
				<svg className="icon icon-twitter" dangerouslySetInnerHTML={{ __html: '<use class="svg" xlink:href="#icon-twitter"/>' }} />
				<span>Twitter</span>
			</a>
		)
	}

	generateFacebookButton(show) {
		var shareFacebook = function(e) {
			e.preventDefault();

			var popUp = window.open(
				'http://www.facebook.com/sharer.php?u=http://example.com',
				'popupwindow',
				'scrollbars=yes,width=800,height=400'
			);

			popUp.focus();
			return false;
		};

		return (
			<a className="facebook" href="#" onClick={ shareFacebook }>
				<svg className="icon icon-facebook" dangerouslySetInnerHTML={{ __html: '<use class="svg" xlink:href="#icon-facebook"/>' }} />
				<span>Facebook</span>
			</a>
		);
	}

	generateEmailButton(show) {
		return (
			<a className="email" href="">
				<svg className="icon icon-letter" dangerouslySetInnerHTML={{ __html: '<use class="svg" xlink:href="#icon-letter"/>' }} />
				<span>Email</span>
			</a>
		);
	}

	generateTextButton(show) {
		return (
			<a className="text" href="">
				<svg className="icon icon-phone" dangerouslySetInnerHTML={{ __html: '<use class="svg" xlink:href="#icon-phone"/>' }} />
				<span>Text</span>
			</a>
		);
	}

	render() {
		var show = this.props.show;

		var facebook = this.generateFacebookButton(show);
		var twitter = this.generateTwitterButton(show);
		var email = this.generateEmailButton(show);
		var text = this.generateTextButton(show);

		return (
			<div className="col-3 share" onClick={ this.props.toggleShare }>
				<svg className="icon icon-share" dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-share"/>' }} />
				<span>Share</span>
				<div className="share-box">
					{ facebook }
					{ twitter }
					{ email }
					{ text }
					<div className="cancel" onClick={ this.props.toggleShare }>
						Cancel
					</div>
				</div>	
			</div>
		)
	}
};