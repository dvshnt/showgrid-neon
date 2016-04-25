import React from 'react';
var GridEngine = require('util/GridEngine');
import FormButton from './FormButton';
import windowScroll from 'util/windowScroll';
import classNames from 'classnames';
import $ from 'jquery';
import I from 'intui/source/Slide';
import SlideMixin from 'intui/source/Mixin';
import * as op from 'operator';



var Modal = React.createClass({
	mixins: [SlideMixin],
	
	getInitialState: function(){
		return {
			visible: false,
			pos :1
		}
	},
	
	getDefaultProps: function(){
		return {
			error: null,
			
			page_index: 0,
		}
	},
	
	componentWillReceiveProps: function(props,state){
		// if(props.visible) windowScroll.disable();
		// else if(!props.visible) windowScroll.enable();

	},

	preventClose: function(e){
		
	},

	onKeyPress: function(e){
		if(e.keyCode == 27){
			this.close();
		}
	},

	componentDidMount: function(){
		window.modal = this;
		document.addEventListener("keydown", this.onKeyPress, false);
		setTimeout(()=>{this.setState({visible:true})}, 10);
		// if(this.props.visible) windowScroll.disable();
	},

	componentWillUnmount: function(){
		document.removeEventListener("keydown", this.onKeyPress, false);
		// windowScroll.enable();
	},

	set: function(){
		this.setState({
			pos: this.state.pos == 1 ? 0 : 1
		})
	},

	close: function(){
		if(this.props.error != null){
			this.props.onResetError()
		}else{
			this.props.onClose()
		}
	},

	render: function(){
		return (
			<div className = 'modal-wrapper'>
				
				<div className = {"modal modal-visible" + ' ' + (this.props.className || '')} style ={{height:this.props.height}}>
					<svg onClick={this.close} className="icon icon-close" dangerouslySetInnerHTML={{ __html: '<use class="svg" xlink:href="#'+(this.props.page_index == 0 ? "icon-close":"icon-back")+'"/>' }} />
					<I ref = "slide" slide vertical index_pos = { this.props.error != null ? 1 : 0 } >
						<I slide beta = {100} index_pos = {this.props.page_index}>
							{this.props.children}
						</I>
						<I slide vertical height = {60} onClick = { this.props.onResetError } c="modal-error">
							<svg onClick={this.close} className="icon icon-close" dangerouslySetInnerHTML={{ __html: '<use class="svg" xlink:href="#icon-close"/>' }} />
							<span>{this.props.error}</span>
						</I>
					</I>
				</div>
				<div onClick={op.closeModal} ref = 'overlay' className={"modal-overlay "+(this.state.visible ? 'overlay-visible' : '') } />
			</div>
		)
	}
})

export default Modal



