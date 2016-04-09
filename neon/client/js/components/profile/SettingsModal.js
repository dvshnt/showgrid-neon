//react based modal to change profile settings, edit alerts and favorite / unfavorite shows.
import ListItemSm from '/components/ListItemSm'

var SettingsModal = React.createClass({
	getInitialState: function(){
		return {
			loading: false,
			alerts_tab: false,

		}
	},
	
	getDefaultProps: function(){
		return {
			alerts_tab: false
		}
	},

	componentWillReceiveProps: function(props,state){
		if(props.alerts_tab != this.state.alerts_tab){
			this.setState({
				alerts_tab: props.alerts_tab
			})
		}
	},


	update_pic: function(){



		this.setState({
			loading: true,
		})
		

		window.fetch('/user/rest/profile-pic',{
			method: 'put',
			headers: {
				'Accept': 'application/json','Content-Type': 'application/json','X-CSRFToken': $("input[name=csrfmiddlewaretoken]").val()
			},	
		}).then((res)=>{
			window.user = profile;
			op.showSettingsModal();		
		}).catch(()=>{
			this.setState({
				loading: false,
				error: 'update failed'
			})
    	});
	},

	update: function(){

		var user = {
			name : this.refs.name.value,
			email : this.refs.email.value,
			current_pass : this.refs.current_pass.value,
			new_pass : this.refs.new_pass.value,
			new_pass_confirm =  this.refs.new_pass_confirm.value
		}
		

		if( user.name == user.email == user.current_pass == user.new_pass == user.new_pass_confirm == ""){
			return this.setState({
				error: "nothing to save",
			})
		}else if(user.new_pass != user.new_pass_confirm){
			return this.setState({
				error: "passwords dont match",
			})		
		}

		this.setState({
			loading: true,
		})

		window.fetch('/user/rest/profile',{
			method: 'put',
			headers: {
				'Accept': 'application/json','Content-Type': 'application/json','X-CSRFToken': $("input[name=csrfmiddlewaretoken]").val()
			},
			body: JSON.stringify(user)
		}).then(function(user){
			window.user = profile;
			op.renderSettings();
		}).catch(()=>{
      	 	this.setState({
      	 		loading: false,
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
				clear alerts
				change alerts
		*/


		// var alerts_list = window.user.alerts.map((alert)=>{
		// 	return (
		// 		<ListItemSm show={alert.show} alerts_only={true} />
		// 	)
		// })


		return (
			<Modal className = {'profile-settings'}  error = {this.state.error} page_index = {this.state.alerts_tab ? 1 : 0}  />
				/* alerts */
				
				<I vertical c = 'profile-settings-main'>
					<I vertical beta = {100} c = 'profile-settings-main'>
						
						<I center>
							<div onClick = {this.clearAlerts} c = 'profile-settings-action'>clear all alerts</div>
						</I>
						<I center>
							<div onClick = {this.disableAlerts} c = 'profile-settings-action'>disable all alerts</div>
						</I>

						<I center c="profile-settings-picture">
							<span className="profile-settings-cat" >change email</span>
							<input onChange = {this.resetState} ref="current_pass" type="file" placeholder= {"Old Password" } />
						</I>
						
						<I center c="profile-settings-bio">
							<span className="profile-settings-cat" >profile bio</span>
							<textarea maxlength="200" ref="bio" onChange={this.resetState} placeholder="Tell us about yourself...">{ bio }</textarea>
						</I>
						
						<I center c="profile-settings-email">
							<span className="profile-settings-cat" >change email</span>
							<input onChange = {this.resetState} ref="current_pass" type="email" placeholder= {"Old Password" } />
						</I>

						<I vertical c="profile-settings-password">
							<span className="profile-settings-cat">change password</span>
							<I center>
								<input onChange = {this.resetState} ref="current_pass" type="password" placeholder= {"Old Password" } />
							</I>
							<I center>
								<input onChange = {this.resetState} ref="new_pass" type="password" placeholder= {"New Password" } />
							</I>
							<I center>
								<input onChange = {this.resetState} ref="new_pass_confirm" type="password" placeholder= {"Confirm New Password" } />
							<I/>
						</I>

						<I c="profile-settings-more">

							<I center>
								<div onClick = {this.disableAlerts} c = 'profile-settings-action'>delete account</div>
							</I>
							<I center>
								<div onClick = {this.disableAlerts} c = 'profile-settings-action'>disable all alerts</div>
							</I>							
						</I>



						<p>main settings</p>
					</I>
					<I center>
						<div className="profile-settings-save">save</div>
					</I>
				</I>

				<I vertical c = 'profile-settings-alerts'>
					<I  c = 'profile-settings-alerts-actions'>

						<I center>
							<div onClick = {} c = 'profile-settings-alerts-actions-disable'>disable all alerts</div>
						</I>

						<I center>
							<div c = 'profile-settings-alerts-actions-method'>method: by phone</div>
						</I>
					</I>
				 	<I vertical c = 'profile-settings-alerts-list'>
				 		{alerts_list}			
				 	</I>
				</I>
			</Modal>
		)
	}
})

export SettingsModal
