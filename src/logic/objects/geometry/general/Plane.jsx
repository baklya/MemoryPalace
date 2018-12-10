import React from 'react';
import gql from 'graphql-tag';

import { Query } from 'react-apollo';

import { Board } from 'ROOT/logic/objects/components/Board.jsx';
import { Tile } from './Tile.jsx';


import { DIRECTION } from 'ROOT/server/logic/Movement';


import 'ROOT/style/objects/geometry/general/Plane.less';



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

	_renderTiles() {
		const result = [];
		for (let i = Math.min(this.state.start.x, this.state.end.x); i <= Math.max(this.state.start.x, this.state.end.x); i++) {
			for (let j = Math.min(this.state.start.y, this.state.end.y); j <= Math.max(this.state.start.y, this.state.end.y); j++) {
				for (let k = Math.min(this.state.start.z, this.state.end.z); k <= Math.max(this.state.start.z, this.state.end.z); k++) {
					result.push(<Tile key={`${i}@${j}@${k}`} x={i} y={j} z={k} pos={this.state.direction} color={this.state.color} texture={this.state.texture} text={this.state.text} />)
				}
			}
		}
		return result;
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


						// TODO change _renderTiles to render only one plane

						console.log('PLANE QUERY')
						return (
							<div className="plane__container">
								{ this._renderBoards(data.state.boards) }
								{ this._renderTiles() }
							</div>
						);
					}}
				</Query>
			</PlaneContext.Provider>
		);
	}
}


