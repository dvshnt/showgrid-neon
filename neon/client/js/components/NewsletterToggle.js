import React, { Component } from 'react';
import * as op from 'operator';

var NewsletterToggle = React.createClass({
	getInitialState: function(){
		return {
			toggled: this.props.profile.newsletter
		}
	},
	toggle: function(){
		// console.log("test")
		op.toggleNewsLetter(!this.props.profile.newsletter).then(op.renderNewsLetterToggle);
		this.setState({
			toggled : !this.state.toggled
		})
	},
	render: function(){
		return (
			<div className = 'newsletter-toggle'>
				<input type="checkbox" onChange = {this.toggle} checked = {this.state.toggled} />
				<span>receive newsletter</span>
				
			</div>
		)
	}
})

export default NewsletterToggle;