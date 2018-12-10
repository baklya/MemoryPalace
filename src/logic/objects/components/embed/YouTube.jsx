import React from 'react';
//import { Card } from './Card.jsx';

import 'ROOT/style/objects/components/Board.less';



import { State } from 'ROOT/logic/stores/HOM';
import { COMPASS } from 'ROOT/logic/constants/Compass';

// TODO get parent pos

// TODO add iframe with https://awwapp.com/


export class YouTube extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			x: props.x || 0,
			y: props.y || 0,
			pos: props.pos !== undefined ? props.pos : COMPASS.NORTH,
			
			color: props.color,


			// TODO random id
			id: Math.random() + '',
		};
		
		this._canvasId = Math.random() + '';
		
	}
	

	
	componentDidMount() {

	}
	
//	translate3d(-600px, -300px, 0px) rotateX(0deg) rotateY(0deg)
	
	render() {
		
		console.log('render tile')
		
		return (
			<div id={this.state.id} className="board__container" style={{ transform: 'translate3d(-300px, -300px, 10px) scale(0.5, 0.5)' }}>
			
			
				
				<iframe width="560" height="315" src="https://www.youtube.com/embed/ueupsBPNkSc?rel=0" frameborder="0" allow="autoplay; encrypted-media" allowfullscreen></iframe>

				<div className="board__shadow" style={{ transform: 'translate3d(-50px, -550px, -8px)' }} />
			</div>
		);
	}


}
