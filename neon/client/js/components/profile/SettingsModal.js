//react based modal to change profile settings, edit alerts and favorite / unfavorite shows.

var SettingsModal = React.createClass({
	getInitialState: function(){
		return {

		}
	},
	
	getDefaultProps: function(){
		return {
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

	render: function(){



		/*	
			profile basic options
				signup for newsletter
				change profile pic
				change password
				change name
			profile alert options
				change alerts
		*/
		return (
			<Modal className = {'profile-settings'}  error = {this.state.error} page_index = {this.state.page_index}  />
				

				<I vertical innerClassName = {'profile-settings-main'}>
					<I vertical beta = {100} innerClassName = {'profile-settings-main'}>
						
					</I>
				</I>
			

				<I vertical innerClassName = {'profile-settings-main'}>
					<I vertical beta = {100} innerClassName = {'profile-settings-main'}>
						FUCK
					</I>					
				</I>


			
			</Modal>
		)
	}
})

export SettingsModal
