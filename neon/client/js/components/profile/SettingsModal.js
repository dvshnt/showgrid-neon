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


	update: function(){
		var user = {
			name : this.refs.name.value,
			email : this.refs.email.value,
			current_pass : this.refs.current_pass.value,
			new_pass : this.refs.new_pass.value,
			new_pass_confirm =  this.refs.new_pass_confirm.value
		}
		


		if( name == email == current_pass == new_pass == new_pass_confirm == ""){
			return this.setState({
				error: "nothing to save",
			})
		}else if(new_pass != new_pass_confirm){
			return this.setState({
				error: "passwords dont match",
			})		
		}


		window.fetch('/user/rest/profile',{
			method: 'put',
			headers: {
				'Accept': 'application/json','Content-Type': 'application/json','X-CSRFToken': $("input[name=csrfmiddlewaretoken]").val()
			},
			body: JSON.stringify()
		}).then(function(user){
			window.user = profile;
			op.renderSettings();
		}).catch(()=>{
      	 	this.setState({
      	 		error: 'update failed'
      	 	})
    	});




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
				<I>

				</I>

				<I vertical c = 'profile-settings-main'>
					<I vertical beta = {100} c = 'profile-settings-main'>
						<p>main settings</p>
					</I>
				</I>
			

				<I vertical c = 'profile-settings-main'>
					<I vertical beta = {100} c = 'profile-settings-main'>
						<p>main settings</p>
					</I>					
				</I>
			</Modal>
		)
	}
})

export SettingsModal
