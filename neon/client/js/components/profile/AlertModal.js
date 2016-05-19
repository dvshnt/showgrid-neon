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

		var show_options = this.props.times.filter(this.timeFilter).map((d)=>{return this.makeOption(d,false)})
		var sale_options = [this.props.times[0],this.props.times[1],this.props.times[2]].filter(this.timeFilter).map((d)=>{return this.makeOption(d,true)})
		// sale_options.unshift(<option key ='option_blank'>------------</option>)
		// show_options.unshift(<option key ='option_blank'>------------</option>)

		
		var today = moment();
		var d = moment(show.raw_date);
		var sd = moment(show.onsale);
		var sale_alert = null

		if(show.onsale != null && today < sd ) {
			sale_alert = (
				<I beta = {50} center c="alert-modal-submit-sale alert-modal-submit-option" onClick={this.setAlertType}>
					<svg dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-ticket"/>' }} />
					<span>set a sale alert instead</span>
				</I>
			)
		}else if( show.onsale != null){
			
			sale_alert = (
				<I beta = {50} center c="alert-modal-submit-sale alert-modal-submit-option">
					<span>on sale</span>
				</I>
			)			
		}

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
					<I c = 'alert-modal-show' vertical>
						<I height={70} vertical center c='alert-modal-show-info-date' style = {{background:show.venue.secondary_color,color:show.venue.primary_color}}>
							<span className='alert-modal-show-info-date-hour'>{d.format("h:mm a")}</span>
							<span className='alert-modal-show-info-date-day'>{d.format("MMMM Do")}</span>
						</I>
						<I c = 'alert-modal-show-info' center vertical>
							<span  onClick = {()=>{window.location.href = show.ticket}} className='alert-modal-title'>{ show.title } </span>
							<span onClick = {()=>{window.location.href = show.ticket}} className='alert-modal-headliners'>{ show.headliners }</span>
							<span  onClick = {()=>{window.location.href = show.ticket}} className='alert-modal-openers'>{ show.openers }</span>
							<div className = 'alert-modal-venue'>
								<span  onClick={()=>{ window.location.href = '/venue/'+show.venue.id  }} className='alert-modal-venue-name' style={{color:show.venue.primary_color}}>{ show.venue.name }</span>
							</div>
							
						</I>
					</I>
					<I height = {100} slide index_pos = {this.state.sale_tab ? 1 : 0}>
						<I vertical c={"alert-modal-tab-show"} >
							{sale_alert}
							<I center>
								<form onSubmit = {this.choose}>
									<select className = 'alert-modal-select' /*onChange = {this.choose}*/ ref = 'show_select'>{show_options}</select>
								</form>
								<div onClick = {this.choose} className='alert-modal-submit-show'>
									<svg dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-alert"/>' }} />
									<span>set</span>
								</div>
							</I>
						</I>
						<I vertical c={"alert-modal-select-sale"} >
							<I beta = {50} center c="alert-modal-submit-show alert-modal-submit-option" onClick={this.setAlertType}>
								<svg dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-alert"/>' }} />
								<span >set a show alert instead</span>
							</I>							
							<I center>
								<form onSubmit = {this.choose}>
									<select className = 'alert-modal-select' /*onChange = {this.choose}*/ ref = 'sale_select'>{sale_options}</select>
								</form>
								<div onClick = {this.choose} className='alert-modal-submit-sale'>
									<svg dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-ticket"/>' }} />
									<span>set</span>
								</div>
							</I>
						</I>
					</I>
				</I>
			</Modal>
		)
	}
})

export default AlertModal