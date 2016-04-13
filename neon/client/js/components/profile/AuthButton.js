//social auth button
import React, { Component } from 'react';


var AuthButton = React.createClass({
	getDefaultProps: function(){
		return {
			type: 'facebook'
		}
	},
	render: function(){
		var link = window.user.auth_links[this.props.type]
		if(link == null){
			throw new Error("bad auth button type")
		}
		return (
			<a href = { link+'?next='+window.encodeURI(window.location.href) } className={"button-"+this.props.type} >
				<svg dangerouslySetInnerHTML={{ __html: '<use xlink:href="#icon-'+this.props.type+'"/>' }} />
			</a>
		)
	}
})

export default AuthButton;