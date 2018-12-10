import React from 'react';

import 'ROOT/style/objects/geometry/general/Tile.less';

import { DIRECTION } from 'ROOT/server/logic/Movement';

// TODO add add new card feature
// TODO rotate wall 


// TODO access to siblings


export class Tile extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			x: props.x || 0,
			y: props.y || 0,
			z: props.z || 0,
			pos: props.pos !== undefined ? props.pos : DIRECTION.NORTH,
			
			color: props.color,
			text: props.text || '',
			
			texture: props.texture,
			
			content: props.content,

			// TODO random id
			id: Math.random() + '',
		};
		
		this._canvasId = Math.random() + '';
		
	}
	

	
	shouldComponentUpdate(nextProps, nextState) {
		return false;
	}
	
	render() {
		
		console.log('render tile')
		
		return (
			<div id={this.state.id} className={this._calculateClassName()} style={{ transform: this._calculateTransform(), backgroundColor: this.state.color }}>
				<canvas id={this._canvasId} style={{width: 300, height: 300}}/>
			
				{this.state.text}
			</div>
		);
	}


	_calculateClassName() {
		
		
		if (this.state.texture === 'bricks') {
			return 'tile__container tile__container--bricks';
		}
		
		if (this.state.texture === 'wood-planks') {
			return 'tile__container tile__container--wood-planks';
		}

		return `tile__container${this.state.texture === 'hexagonal' ? ' tile__container--hexagonal' : ''}`;
	}


	_calculateTransform() {
		const TILE_SIZE = 300;

		let xdeg = 0;
		if (this.state.pos == DIRECTION.DOWN) {
			xdeg = 90
		}
		if (this.state.pos == DIRECTION.UP) {
			xdeg = -90
		}
		
		let ydeg = 0;
		if (this.state.pos == DIRECTION.SOUTH) {
			ydeg = 180;
		}
		if (this.state.pos == DIRECTION.WEST) {
			ydeg = 90
		}
		if (this.state.pos == DIRECTION.EAST) {
			ydeg = -90
		}
		
		let xpx = this.state.x * TILE_SIZE;
		if (this.state.pos == DIRECTION.WEST) {
			xpx -= TILE_SIZE / 2;
		}
		if (this.state.pos == DIRECTION.EAST) {
			xpx += TILE_SIZE / 2;
		}
		
		let ypx = this.state.y * TILE_SIZE;
		if (this.state.pos == DIRECTION.DOWN) {
			ypx += TILE_SIZE / 2;
		}
		if (this.state.pos == DIRECTION.UP) {
			ypx -= TILE_SIZE / 2;
		}
		
		let zpx = this.state.z * TILE_SIZE;
		if (this.state.pos == DIRECTION.DOWN) {
			zpx += TILE_SIZE / 2;
		}
		if (this.state.pos == DIRECTION.SOUTH) {
			zpx += TILE_SIZE;
		}
		if (this.state.pos == DIRECTION.WEST) {
			zpx += TILE_SIZE / 2;
		}
		if (this.state.pos == DIRECTION.EAST) {
			zpx += TILE_SIZE / 2;
		}
		if (this.state.pos == DIRECTION.UP) {
			zpx += TILE_SIZE / 2;
		}

		const translate3d = `translate3d(${xpx}px, ${ypx}px, ${zpx}px)`
		const rotate = `rotateX(${xdeg}deg) rotateY(${ydeg}deg)`
		return `${translate3d} ${rotate}`;
	}
}
