import React, { Component } from 'react';
var GridEngine = require('../util/GridEngine');
import FormButton from './FormButton';
import windowScroll from '../util/windowScroll';
import classNames from 'classnames';
import $ from 'jquery';
import {Slide,SlideMixin} from 'intui';



var ModalPage = react.createClass({
	mixin: SlideMixin,
	render: function(){
		return (
			<Slide beta = {100} className="modal-page">
				{this.props.children}
			</Slide>
		)		
	}
});


var Modal = react.createClass({
	
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
		if(props.visible != this.props.visible){
			this.setState({
				visible: props.visible
			})
		}
	},
	
	toggle: function(){
		this.setState({
			visible: !this.state.visible
		})
	},

	render: function(){
		return (
			<div onClick={this.toggle} className={"overlay-"+(this.state.visible ? 'visible' : 'hidden')}>
				<svg onClick={this.toggle} className="icon icon-close" dangerouslySetInnerHTML={{ __html: '<use class="svg" xlink:href="#icon-close"/>' }} />
				<Slide slide vertical index_pos = { this.props.error != null ? 0 : 1 } height = '90%' >
					<Slide beta = {10} onClick = { this.props.closeError} outerClassName="modal-error" >
						<span>{this.state.error}</span>
					</Slide>
					<Slide slide beta = {100} index_pos = {this.props.index_pos}>
						{this.props.children}
					</Slide>
				</Slide>
			</div>
		)
	}

});


export default Modal
