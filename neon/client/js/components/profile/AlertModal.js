import I from 'intui/source/Slide';
import React from 'react'
import Modal from 'components/Modal';
import * as op from 'operator';
import moment from 'moment';


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
		d.setTime(d.getTime() + (d.getTimezoneOffset() - (GLOBAL_UTC))*60000 );
		var show_d = new Date(this.props.show.raw_date);
		var diff = show_d.getTime() - d.getTime();
		if( diff < (time*60000)) return false
		return true
	},

	removeSaleAlert: function(){
		this.setState({
			sale_alert: null,
		})
		op.deleteAlert(this.state.sale_alert.id)
	},

	choose: function(){

		
		if(this.state.sale_tab){
			var e = this.refs.sale_select;
		}else{
			var e = this.refs.show_select;
		}

		this.setAlert(e.selectedIndex,this.state.sale_tab);
	},

	componentDidMount: function(){
		// if(this.state.sale_tab){
		// 	setTimeout(()=>{
		// 		this.refs.sale_select.focus()
		// 	}, 500);
			
		// }else{
		// 	setTimeout(()=>{
		// 		this.refs.show_select.focus()
		// 	}, 500);
			
		// }
	},

	setAlertType: function(){
		var type = !this.state.sale_tab;

		// setTimeout(()=>{
		// 	if(type){
		// 		this.refs.sale_select.focus()
		// 	}else{
		// 		this.refs.show_select.focus()
		// 	}
		// },500)
		this.setState({
			sale_tab: type,
		})
	},

	render: function(){
		var show = this.props.show

		var show_options = <optgroup label="Before Show Starts">{ this.props.times.filter(this.timeFilter).map((d)=>{return this.makeOption(d,false)}) }</optgroup>
		var sale_options = <optgroup label="Before Tickets Go on Sale">{ [this.props.times[0],this.props.times[1],this.props.times[2]].filter(this.timeFilter).map((d)=>{return this.makeOption(d,true)}) }</optgroup>
		// sale_options.unshift(<option key ='option_blank'>------------</option>)
		// show_options.unshift(<option key ='option_blank'>------------</option>)

		
		var today = moment();
		var d = moment(show.raw_date);
		var sd = moment(show.onsale);
		var sale_alert = null

		if ( !this.timeFilter(0) ){
			return (
				<Modal height = {'300px'} onClose={op.closeModal} onResetError = {this.setState.bind(this,{error:null})} error = {this.state.error} className = {'alert-modal'} >
					<I vertical center >
						<span>show started</span>
					</I>
				</Modal>
			)
		} 

	
		return (
			<Modal height={ '300px' } onClose={ op.closeModal } onResetError={this.setState.bind(this,{error:null})} error = {this.state.error} className = {'alert-modal'} >
				<I vertical >
					<I height={55} vertical center c='alert-modal-show-info-date'>
						<span className='alert-modal-show-info-datetime'>{d.format("MMMM Do h:mm a")}</span>
					</I>
					<I beta={ 70 } c= 'alert-modal-show-info' center vertical>
						<span className='alert-modal-venue-name' style={{color:show.venue.primary_color}}>{ show.venue.name }</span>
						<span className='alert-modal-title'>{ show.title } </span>
						<span className='alert-modal-headliners'>{ show.headliners }</span>
						<span className='alert-modal-openers'>{ show.openers }</span>
					</I>
					<I beta={40} center vertical>
						<form className="alert-form" onSubmit = {this.choose}>
							<span>&#9660;</span>
							<select width="300" className='alert-modal-select' /*onChange = {this.choose}*/ ref = 'show_select'>
								{show_options}
								{sale_options}
							</select>
						</form>
						<div onClick = {this.choose} className='alert-modal-submit-alert'>
							<svg dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-alert"/>' }} />
							<span>Set Alert</span>
						</div>
					</I>
				</I>
			</Modal>
		)
	}
})

export default AlertModal