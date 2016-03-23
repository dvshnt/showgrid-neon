import React from 'react';
import UserProfile from './components/Profile';
import PhoneModal from './components/PhoneModal';

module.exports.renderProfile = renderProfile
function renderProfile(props){
	props = props || {}
	var userProfile = document.getElementById('profile')
	if(!!userProfile){
		React.render(<UserProfile tab = {props.tab || 'alert'} profile={window.user} />,userProfile);
	}
}


module.exports.renderPhoneModal = renderPhoneModal
function renderPhoneModal(visible){
	React.render(<PhoneModal visible={visible} />,document.getElementById('overlay-wrapper'));
}
