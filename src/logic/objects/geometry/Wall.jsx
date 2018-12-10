import React from 'react';
import { Card } from './Card.jsx';

import './style/Wall.less';

// TODO add add new card feature
// TODO rotate wall 


export class Wall extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			index: props.index || 0,
			row: props.row || 0,
		};
		
		//this.ssss = this.ssss.bind(this);
		
	}
	
	
	translateXMapper() {
		
		console.log('ssss')
		
		if (this.state.index == 0) {
			return -this.state.row * 100;
		}
		
		if (this.state.index == 1) {
			return this.state.row * 100;
		}
	}
	
	
	componentDidMount() {
	//	new Twitch.Embed("twitch-embed", {
	//		width: 300,
	//		height: 450,
	//		channel: "monstercat"
	//	});
	}
	
	
	
	render() {
		return (
			
			<div className="wall__start-point" style={ {transform: `translateX(${(1 - this.state.index) * 66}%)` }} >
				<div className="wall__container" style={ {transform: `translateX(${this.translateXMapper()}%)` }}>
					<Card />
				</div>
			</div>
			

		);
	}
}
