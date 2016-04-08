import React, { Component } from 'react';
var GridEngine = require('util/GridEngine');
import FormButton from './FormButton';
import windowScroll from 'util/windowScroll';
import classNames from 'classnames';
import $ from 'jquery';
import {Slide,SlideMixin} from 'intui';




var Modal = React.createClass({
	mixins: [SlideMixin],
	
	getInitialState: function(){
		return {
			pos :1
		}
	},
	
	getDefaultProps: function(){
		return {
			error: null,
			visible: false,
			page_index: 0,
		}
	},
	
	componentWillReceiveProps: function(props,state){

	},

	preventClose: function(e){
		console.log("DONT CLOSE")
		e.preventDefault()
		e.stopPropagation()
	},

	componentDidMount: function(){
		window.modal = this
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
			<div ref = 'overlay' className={"overlay "+(this.props.visible ? 'overlay-visible' : '')}>
				<div onClick={this.props.onClose}  className={"overlay-cover"} />
				<div className = {"modal modal-"+(this.props.visible ? 'visible' : 'hidden')}>
					<svg onClick={this.close} className="icon icon-close" dangerouslySetInnerHTML={{ __html: '<use class="svg" xlink:href="#icon-close"/>' }} />
					<Slide ref = "slide" slide vertical index_pos = { this.props.error != null ? 0 : 1 } >
						<Slide center beta = {10} onClick = { this.props.onResetError} outerClassName="modal-error" >
							<span>{this.props.error}</span>
						</Slide>
						<Slide slide beta = {100} index_pos = {this.props.page_index}>
							{this.props.children}
						</Slide>
					</Slide>
				</div>
			</div>
		)
	}
})


export default Modal
