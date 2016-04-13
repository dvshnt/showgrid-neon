const GLOBAL_UTC = -6;
import React, { Component } from 'react';
import * as op from 'operator';
import ListItemSm from 'components/ListItemSm';

var setAlert = React.createClass({
	getInitialState: function(){
		return {
			show_alert: null,
			sale_alert: null,
		}
	},

	//update the state of the button and what the toggler will do.
	update: function(){
		window.user.alerts.filter((alert)=>{
			return alert.show.id == this.props.show.id
		}).forEach((a)=>{
			if(a.sale == true) this.setState({ sale_alert : a })
			else this.setState({ show_alert : a })
		})
	},

	//toggle alert modal / delete all alerts
	toggle: function(){
		// if(!window.user.phone){
		// 	return op.showProfileSettings(2)
		// }
		if(this.state.show_alert == null && this.state.sale_alert == null){
			op.showAlertModal(this.props.show,this.update)
		}else{
			op.deleteAlert(this.state.show_alert)
			this.setState({
				show_alert: null,
				sale_alert: null
			})
		}
	},

	componentDidMount: function(){
		this.update()
	},

	render: function(){
		return (
			<div onClick = {this.toggle} className = { (this.props.className || "")+" alert-button " + (this.state.sale_alert != null ? "alert-button-sale" : (this.state.show_alert != null ? "alert-button-show" : "")) }>
				<svg dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-alert"/>' }} />
			</div>
		)
	}
})

export default setAlert