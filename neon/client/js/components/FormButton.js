import React, { Component } from 'react';

export default class FormButton extends Component {
	componentDidMount() {
		if (this.props.focus) {
			React.findDOMNode(this.refs.formButton).focus();
		}
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.focus) {
			React.findDOMNode(this.refs.formButton).focus();
		}
	}

	render() {
		var errorClass = (this.props.error) ? "submit error" : "submit";
		var buttonText = (this.props.error) ? this.props.errorMessage : this.props.submitMessage;

		return (
			<input type="submit" ref="formButton" className={ errorClass } value={ buttonText } onClick={this.props.onClick}/>
		)
	}
};