import React from 'react';
import gql from 'graphql-tag';

import { Query } from 'react-apollo';

import { Board } from 'ROOT/logic/objects/components/Board.jsx';

import { TILE_SIZE, DIRECTION } from 'ROOT/server/logic/Movement';


import 'ROOT/style/objects/geometry/general/Plane.less';


//BricksSmallOld
import * as bricks from 'ROOT/resourses/textures/walls/BricksSmallOld.jpg'
import * as hexagonal from 'ROOT/resourses/textures/floors/Hexagonal.jpg'

import * as woodPlanks from 'ROOT/resourses/textures/wood/WoodPlanksPainted.jpg'
///hom/src/resourses/textures/wood/WoodPlanksPainted.jpg

const textureMap = {
	bricks: bricks,
	hexagonal: hexagonal,
	'wood-planks': woodPlanks,
}


//import * as hex from 'ROOT/resourses/textures/walls/Hex.gif'

export const PlaneContext = React.createContext();

/*
export const BoardQuery = gql`
	query b($planeId: String!) {
	  boards(planeId: $planeId) @client {
	    id
	    planeId
	    x
	    y
	    links
	  }
	}
`;*/

export const BOARD_QUERY = gql`
  query InitState {
	state @client {
	    boards {
    	    id
		    planeId
		    x
		    y
		    links
	    }
	}
  }
`;




export class Plane extends React.Component {
	constructor(props) {

		super(props);
		this.state = {
			id: props.id,
			start: props.start || { x: 0, y: 0, z: 0 },
			end: props.end || { x: 0, y: 0, z: 0 },
			color: props.color,
			direction: props.direction !== undefined ? props.direction : DIRECTION.NORTH,
			texture: props.texture,
			text: props.text,
			
		};
	}


	_renderPlane() {
		
		const style = this._calculateStyle();
		
		
		//background-image: url("~ROOT/resourses/textures/walls/Hex.gif");
		
		return (
			<div className={ 'plane__container--inner' } style={ style }>
				<svg xmlns="http://www.w3.org/2000/svg" version="1.1" width={ style.width } height={ style.height }>
					<defs>
					  <pattern id={ this.props.texture } patternUnits="userSpaceOnUse" width="300" height="300">
					    <image xlinkHref={ textureMap[this.props.texture] } x="0" y="0" width="300" height="300" />
					  </pattern>
					</defs>
					<rect width={ style.width } height={ style.height } fill={ `url(#${this.props.texture})` } />
				</svg>
			</div>
		);
	}

	_calculateStyle() {
		const { start, end, direction } = this.state;

		const xSize = Math.max(start.x, end.x) - Math.min(start.x, end.x) + 1;
		const ySize = Math.max(start.y, end.y) - Math.min(start.y, end.y) + 1;
		const zSize = Math.max(start.z, end.z) - Math.min(start.z, end.z) + 1;

		let height = 0;
		let width = 0;

		if (direction == DIRECTION.NORTH || direction == DIRECTION.SOUTH) {
			width = xSize * TILE_SIZE;
			height = ySize * TILE_SIZE;
		} else if (direction == DIRECTION.EAST || direction == DIRECTION.WEST) {
			width = zSize * TILE_SIZE;
			height = ySize * TILE_SIZE;
		} else if (direction == DIRECTION.UP || direction == DIRECTION.DOWN) {
			width = xSize * TILE_SIZE;
			height = zSize * TILE_SIZE;
		}


		const xFromLeft = direction === DIRECTION.NORTH || direction === DIRECTION.DOWN;
		const zFromLeft = direction === DIRECTION.WEST;

		const topLeftPos = {
			x: (xFromLeft ? Math.min : Math.max)(start.x, end.x),
			y: Math.min(start.y, end.y),
			z: (zFromLeft ? Math.max : Math.min)(start.z, end.z),
		}

		let xdeg = 0;
		let ydeg = 0;
		let zdeg = 0;

		let xpx = topLeftPos.x * TILE_SIZE;
		let ypx = topLeftPos.y * TILE_SIZE;
		let zpx = topLeftPos.z * TILE_SIZE;

		switch (direction) {
			case DIRECTION.SOUTH:
				ydeg = 180;
				xpx += TILE_SIZE;
				zpx += TILE_SIZE;
				break;
			case DIRECTION.WEST:
				ydeg = 90
				zpx += TILE_SIZE;
				break;
			case DIRECTION.NORTH:
				break;
			case DIRECTION.EAST:
				ydeg = -90
				xpx += TILE_SIZE;
				break;
			case DIRECTION.DOWN:
				xdeg = 90
				ypx += TILE_SIZE;
				break;
			case DIRECTION.UP:
				xdeg = -90;
				zdeg = -180;
				xpx += TILE_SIZE;
				break;
		}

		const translate3d = `translate3d(${xpx}px, ${ypx}px, ${zpx}px)`
		const rotate = `rotateX(${xdeg}deg) rotateY(${ydeg}deg) rotateZ(${zdeg}deg)`


		return {
			height: height,
			width: width,
			transform: `${translate3d} ${rotate}`
		}
	}


	_renderBoards(boards) {
		return boards.map((board) => (
			
			board.planeId !== this.props.id ?
				null :
				<Board key={ board.id } id={ board.id } x={ board.x } y={ board.y } links={ board.links } />
		));
	}





	render() {
		const { id } = this.props;

		return (
			<PlaneContext.Provider value={{ start: this.state.start, end: this.state.end, pos: this.state.direction }}>
			

				<Query query={ BOARD_QUERY } variables={{ planeId: id }}>
					{({ loading, error, data, refetch }) => {
						if (loading) return null;
						if (error) return `Error!: ${error}`;

						console.log('PLANE QUERY')
						return (
							<div className="plane__container">
								{ this._renderBoards(data.state.boards) }
								{ this._renderPlane() }
								
								
								
								
								
							</div>
						);
					}}
				</Query>
			</PlaneContext.Provider>
		);
	}
}


