import React from 'react';
import dom from 'react-dom';
import { SettingsModal, ProfilePage, AuthModal , AlertModal } from 'components/profile';
import $ from 'jquery';
import fetch from 'whatwg-fetch';


export function renderPublicProfile(p){
	dom.render(<ProfilePage profile={window.profile} />,document.getElementById('profile'));
}


export function renderPrivateProfile(){
	if(!window.user.is_authenticated){
		Modal()
	}else{
		dom.render(<ProfilePage profile={window.user} />,document.getElementById('profile'));
	}
}


export function renderPhoneModal(){
	closeModal();
	dom.render(<PhoneModal />,document.getElementById('overlay-wrapper'));
}

export function renderAuthModal(){
	if(window.user.is_authenticated){
		return
	}
	closeModal();
	console.log(AuthModal);
	dom.render(<AuthModal  />,document.getElementById('overlay-wrapper'));
}

export function closeModal(){
	dom.unmountComponentAtNode($('#overlay-wrapper')[0])
}








//profile settings modal
export function showProfileSettings(tab){
	closeModal();
	dom.render(<SettingsModal tab_pos = {tab} visible={true} />,document.getElementById('overlay-wrapper'));
}

export function toggleNewsLetter(toggle){

	return $.ajax({
		url: '/user/rest/newsletter',
		method: toggle ? 'post' : 'delete',
		headers: {
			'X-CSRFToken': window.user.csrf
		},
	})
}


// export function updateProfile(profile){
// }


















//alert modal
export function showAlertModal(show,cb){
	closeModal();
	dom.render(<AlertModal onSet={cb} show={show} />,document.getElementById('overlay-wrapper'));
}

export function deleteAlert(id){
	return $.ajax({
		url: '/user/rest/alert?id='+id,
		method: 'delete',
		headers: {
			'X-CSRFToken': window.user.csrf
		},
	}).done((dat)=>{
		window.user.alerts.splice(window.user.alerts.findIndex(function(a){ return a.id == id}), 1)
	})
}

export function setAlert(body){
	console.log(body)

	return $.ajax({
		url: '/user/rest/alert',
		type: 'POST',
		headers: {
			'X-CSRFToken': window.user.csrf
		},
		dataType: 'json',
		data: JSON.stringify(body)
	})
}





