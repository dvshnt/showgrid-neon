import React, { Component } from 'react';

import $ from 'jquery';
import moment from 'moment';

import DateManager from '../util/DateManager';

import Share from './Share';
import Ticket from './Ticket';
import SetAlert from './SetAlert';
import SetFavorite from './SetFavorite';

import AuthModal from './AuthModal';


export default class ShowActions extends Component {
	constructor(props) {
		super(props)

		this.selectAlert = this.selectAlert.bind(this);
		this.toggleShare = this.toggleShare.bind(this);

		this.state = {
			selectAlert: false,
			selectShare: false
		};
	}

	selectAlert() {
		var _this = this;
		this.setState({
			selectAlert: !_this.state.selectAlert
		});
	}

	toggleShare() {
		var _this = this;
		this.setState({
			selectShare: !_this.state.selectShare
		});
	}

	render(){
		var show = this.props.show;

		var mode = this.state.selectAlert ? "dialog-active" : "";

		if (mode === "") {
			mode = this.state.selectShare ? "share-active" : "";
		}
		

		return (
			<div className={ mode }>
				<SetFavorite show={ show } />
				<SetAlert show={ show } selectAlert={ this.selectAlert }/>
				<Share show={ show } toggleShare={ this.toggleShare }/>
				<Ticket show={ show } />
			</div>
		)
	}
};