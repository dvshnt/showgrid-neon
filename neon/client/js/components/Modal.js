import React, { Component } from 'react';
var GridEngine = require('../util/GridEngine');
import FormButton from './FormButton';
import windowScroll from '../util/windowScroll';
import classNames from 'classnames';
import $ from 'jquery';
import {Slide,SlideMixin} from 'intui/dist/intui';




var Modal = react.createClass({
	
	getInitialState: function(){
		return {
			
		}
	},
	
	getDefaultProps: function(){
		return {
			visible: false,
			page_index: 0,
		}
	},
	
	componentWillReceiveProps: function(props,state){
		
	},

	render: function(){
		return (
			<div onClick={this.props.onClose} className={"overlay-"+(this.props.visible ? 'visible' : 'hidden')}>
				<svg onClick={this.props.onClose} className="icon icon-close" dangerouslySetInnerHTML={{ __html: '<use class="svg" xlink:href="#icon-close"/>' }} />
				<Slide slide vertical index_pos = { this.props.error != null ? 0 : 1 } height = '90%' >
					<Slide beta = {10} onClick = { this.props.onResetError} outerClassName="modal-error" >
						<span>{this.state.error}</span>
					</Slide>
					<Slide slide beta = {100} index_pos = {this.props.page_index}>
						{this.props.children}
					</Slide>
				</Slide>
			</div>
		)
	}

})


export default Modal
