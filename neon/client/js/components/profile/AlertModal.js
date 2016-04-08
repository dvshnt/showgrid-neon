var AlertModal = React.createClass({
	getInitialState: function(){
		return {
			page_index: 0
		}
	},
	
	getDefaultProps: function(){
		return {
			dates: [0,30,60,60*2,60*24,60*24*2,60*24*7],
			sales: [0,30,60,60*2],
			page_index: 0,
		}
	},

	componentWillReceiveProps: function(props,state){
		if(props.page_index != this.state.page_index){
			this.setState({
				page_index: props.page_index
			})
		}
	},

	date_filter: function(date){

	},

	setAlert: function(date,sale){

	},

	getDateString: function(date,sale){
		var str = null
		switch(date){
			case 30:
				str = "30 minutes"; break;
			case 60:
				str = "one hour"; break;
			case 60*2:
				str = "two hours"; break;
			case 60*24:
				str = "a day"; break;
			case 60*24*2:
				str = "two days"; break;
			case 60*24*7:
				str = "a week"; break;
		}
		if(str == null) throw "alert modal bad date"
		return str + " before "+(sale ? "sale" : "show")+" starts"
	},

	make_date: function(date){
		return (
			<I center beta = {100} className="alert-modal-option">
				<span onClick = {this.setAlert}>{this.getDateString(date,false)}</span>
			</I>
		)
	},

	make_sale: function(date){
		return (
			<I center beta = {100} className="alert-modal-option">
				<span onClick = {this.setAlert}>{this.getDateString(date,true)}</span>
			</I>
		)
	},


	render: function(){

		var date_options = this.props.dates.map(this.date_filter).map(this.make_date)
		var sale_options = this.props.sales.map(this.sale_filter).map(this.make_sale)



		return (
			<Modal page_index = {this.state.page_index} className = {"alert-modal"} >
				<I vertical innerClassName = {"alert-modal-date"}>
					<I center onClick = {this.setState.bind(this,{page_index: 1})} innerClassName = {"alert-modal-sale-tab"}>
						<span> set an alert for show sale and get instantly notified when the price drops! </span>
					</I>
					<I innerClassName = {"alert-modal-date"}>
						{date_options}
					</I>
				</I>
				<I vertical innerClassName = {"alert-modal-sale"}>
					<I center onClick = {this.setState.bind(this,{page_index: 0})} innerClassName = {"alert-modal-alert-tab"}>
						<span>set an alert for show date</span>
					</I>
					<I innerClassName = {"alert-modal-sale"}>
						{sale_options}
					</I>
				</I>
			</Modal>
		)
	}


			
					if(show.onsale){
			var sale_date = moment(show.onsale, 'YYYY-MM-DD HH:mm:ssZZ');
			if (now.isBefore(sale_date)) {
				options.push(<option value="7"  data-value='{"sale":true, "id":7, "unit":"days","num":0}' selected={ alert.which === 7 }>when ticket sale starts</option>);
			}
			if (now.isBefore(sale_date.clone().subtract(30, 'minutes'))) {
				options.push(<option value="8" data-value='{"sale":true, "id":8, "unit":"minutes","num":30}' selected={ alert.which === 8 }>30 minutes before ticket sale</option>);
			}
			if (now.isBefore(sale_date.clone().subtract(1, 'hours'))) {
				options.push(<option value="9" data-value='{"sale":true, "id":9, "unit":"hours","num":1}' selected={ alert.which === 9 }>1 hour before ticket sale</option>);
			}
			if (now.isBefore(sale_date.clone().subtract(2, 'hours'))) {
				options.push(<option value="10" data-value='{"sale":true, "id":10, "unit":"hours","num":2}' selected={ alert.which === 10 }>2 hours before ticket sale starts</option>);
			}
		}

		</Modal>
	}
})


export AlertModal