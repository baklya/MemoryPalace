import React from 'react';
//import { Card } from './Card.jsx';

import 'ROOT/style/objects/geometry/general/Tile.less';


import { DIRECTION } from 'ROOT/server/logic/Movement';

// TODO add add new card feature
// TODO rotate wall 


// TODO access to siblings


export class Shelf extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			x: props.x || 0,
			y: props.y || 0,
			pos: props.pos !== undefined ? props.pos : DIRECTION.NORTH,
			
			color: props.color,


			// TODO random id
			id: Math.random() + '',
		};
		
		this._canvasId = Math.random() + '';
		
	}
	

	
	componentDidMount() {

	}
	
	
	
	render() {
		
		console.log('render tile')
		
		return (
			<div id={this.state.id} className="shelf_container">
				<canvas id={this._canvasId} style={{width: 300, height: 300}}/>
			</div>
		);
	}


}
