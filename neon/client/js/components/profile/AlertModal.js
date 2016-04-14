import I from 'intui/source/Slide';
import React from 'react'
import Modal from 'components/Modal';
//global alert modal for setting an alert
import * as op from 'operator';
import ListItemLg from 'components/ListItemLg'

const GLOBAL_UTC = 5 * 60

var AlertModal = React.createClass({
	getInitialState: function(){
		return {
			error: null,
			sale_tab: false,
			sale_alert: null,
			done: false
		}
	},
	
	getDefaultProps: function(){
		return {
			show: null,
			times: [0,30,60,60*2,60*24,60*24*2,60*24*7],
			date_str: ["at time of ","30 minutes","one hour","two hours","a day","two days","a week"],
		}
	},

	setAlert: function(which,sale){
		
		if(sale){
			this.setState({
				sale_tab: false
			})
		}

		op.setAlert({
			show: this.props.show.id,
			which: which,
			sale: sale
		}).done((body)=>{
			if(body.status != null || body.detail != null){
				this.setState({error:body.status||body.detail})
			}else{
				window.user.alerts.push(body)
				op.closeModal();
				this.props.onSet();
			}
		}).error((body)=>{
			this.setState({error:body})
		})
	},

	getDateString: function(time,sale){

		var i = this.props.times.indexOf(time);
	
		if(i == 0){
			return ( this.props.date_str[i] + (sale == true ? "sale" : "show") )
		}else{
			return this.props.date_str[i] + " before "+(sale == true ? "sale" : "show")+" starts"
		}
		
	},

	makeOption: function(time,sale){
		return (
			<option key = {(sale == true ? 'sale_' : 'show_')+time}>
				{this.getDateString(time,sale)}
			</option>
		)
	},

	timeFilter: function(time){
		var d = new Date();
		d.setTime(d.getTime() + (d.getTimezoneOffset() - (GLOBAL_UTC))*1000 );
		var show_d = new Date(this.props.show.raw_date);
		var diff = show_d.getTime() - d.getTime();
		console.log(diff);
		if( diff < time*1000) return false
		return true
	},

	removeSaleAlert: function(){
		this.setState({
			sale_alert: null,
		})
		op.deleteAlert(this.state.sale_alert.id)
	},

	choose: function(e){

		
		if(this.state.sale_tab){
			var e = this.refs.sale_select;
		}else{
			var e = this.refs.show_select;
		}

		this.setAlert(e.selectedIndex-1,this.state.sale_tab);
	},

	componentDidMount: function(){
		if(this.state.sale_tab){
			setTimeout(()=>{
				this.refs.sale_select.focus()
			}, 500);
			
		}else{
			setTimeout(()=>{
				this.refs.show_select.focus()
			}, 500);
			
		}
	},

	setAlertType: function(){
		var type = !this.state.sale_tab;

		setTimeout(()=>{
			if(type){
				this.refs.sale_select.focus()
			}else{
				this.refs.show_select.focus()
			}
		},500)
		this.setState({
			sale_tab: type,
		})
	},

	render: function(){

		var show_options = this.props.times.filter(this.timeFilter).map((d)=>{return this.makeOption(d,false)})
		var sale_options = [this.props.times[0],this.props.times[1],this.props.times[2]].filter(this.timeFilter).map((d)=>{return this.makeOption(d,true)})
		sale_options.unshift(<option key ='option_blank'>-----</option>)
		show_options.unshift(<option key ='option_blank'>-----</option>)
		return (
			<Modal height = {'300px'} onClose={op.closeModal} onResetError = {this.setState.bind(this,{error:null})} error = {this.state.error} >
				<I vertical >
					<I vertical center c = "alert-modal-show">
						<div>{new Date(this.props.show.raw_date).toString()}</div>
						<div>{this.props.show.headliners}</div>
						<div>{this.props.show.openers}</div>
					</I>
					<I height = {50}>
						<I center onClick = {op.showProfileSettings.bind(null,2)} c='alert-modal-info-phone'>
							<div > # {window.user.phone || '615-715-7754'}</div>
						</I>
						<I center onClick = {this.setAlertType} c='alert-modal-info-saletab' >
							<div>set a {this.state.sale_tab ? "show" : "sale"} alert </div>
						</I>
					</I>
					<I height = {50}>
						<I slide vertical index_pos = {this.state.sale_tab ? 1 : 0} c={"alert-modal-options"}>
							<I center>
								<select onChange = {this.choose} ref = 'show_select'>{show_options}</select>
							</I>
							<I center>
								<select onChange = {this.choose} ref = 'sale_select'>{sale_options}</select>
							</I>
						</I>
					</I>
				</I>
			</Modal>
		)
	}
})

export default AlertModal