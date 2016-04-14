import React, { Component } from 'react';

import $ from 'jquery';
import moment from 'moment';


import DateManager from 'util/DateManager';

import Ticket from 'components/Ticket';


import { AuthModal , AlertButton , FavoriteButton, ShareButton } from 'components/profile';


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
				<FavoriteButton show={ show } >
					<span>Favorite</span>
				</FavoriteButton>
				<AlertButton className={'col-3'} show={ show }>
					<span>Alert</span>
				</AlertButton>
				<ShareButton show={ show } toggleShare={ this.toggleShare }/>
				<Ticket show={ show } />
			</div>
		)
	}
};