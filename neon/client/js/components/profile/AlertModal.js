import I from 'intui/Slide';

//global alert modal for setting an alert


var AlertModal = React.createClass({
	getInitialState: function(){
		return {
			error: null,
			sale_tab: false,
			sale_alert: null,
		}
	},
	
	getDefaultProps: function(){
		return {
			show: null,
			times: [0,30,60,60*2,60*24,60*24*2,60*24*7],
			date_str: ["30 minutes","one hour","two hours","a day","two days","a week"],
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
			which: which
			sale: sale
		}).then((body)=>{
			var err = null
			if( body.status == 'phone_not_verified' )  err = "phone not verified"
			else if(body.status == 'phone_not_verified') err = "alert already set"

			if(err) return this.setState({ err: err })
			if(body.sale){
				this.setState({
					sale_alert: body
				})
			}else{
				op.closeModal()
			}
			if(this.props.onSet != null) this.props.onSet()
		})
	},

	getDateString: function(time,sale){
		return this.props.date_str[times.indexOf(time)] + " before "+(sale ? "sale" : "show")+" starts"
	},

	makeOption: function(time,sale){
		return (
			<I center beta = {100} c="alert-modal-option">
				<I beta = {20} center>
					<svg className={sale ? "alert-modal-option-icon-alert-sale" : "alert-modal-option-icon-alert-show"} dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-alert"/>' }} />
				</I>
				<I center c="alert-modal-option-name">
					<span onClick = {this.setAlert.bind(this.times.indexOf(time))}>{this.getDateString(time,sale)}</span>
				</I>
			</I>
		)
	},

	timeFilter: function(time){
		var current_time = new Date();
		current_time.setUTCHours(GLOBAL_UTC);
		if(Date.parse(this.props.show.date) - time*1000) < current_time) return null
		return time
	},

	removeSaleAlert: function(){
		this.setState({
			sale_alert: null,
		})
		op.deleteAlert(this.state.sale_alert.id)
	},

	render: function(){

		var show_options = this.props.times.filter(this.timeFilter).map(this.makeOption)
		var sale_options = this.props.times.splice(0,3).filter(this.timeFilter).map(this.makeOption)
		
		return (
			<Modal onClose={op.closeModal} page_index = {this.state.sale_tab ? 1 : 0} onResetError = {this.setState.bind(this,{error:null})} error = {this.state.error} >
				<I vertical c = "alert-modal-options">
					<I vertical c = "alert-modal-top" >
						<I beta = {150} center c = "alert-modal-show" >
							<ListItemSm data = {this.props.show} extra={{onsale_info:true}} />
						</I>
						<I slide vertical index_pos = {this.state.sale_alert ? 1 : 0} >
							<I center c = 'alert-modal-saletoggle-set' onClick={this.setState.bind(this,{sale_tab:true})}>
								<span>set sale alert</span>
							</I>
							<I center c = 'alert-modal-saletoggle-reset' onClick={this.removeSaleAlert}>
								<span>reset sale alert</span>
							</I>
						</I>
					</I>
					<I center c = {"alert-modal-directions"}>
						<span> choose an option for the show alert </span>
					</I>
					<I beta = {200}  vertical c = "alert-modal-options-show">
						{show_options}
					</I>
				</I>
				<I vertical c = "alert-modal-options-sale">
					{sale_options}
				</I>
			</Modal>
		)
	}
})