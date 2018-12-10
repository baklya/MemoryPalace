import React from 'react';
import gql from 'graphql-tag';

import { Query, graphql, withApollo } from 'react-apollo';

import { World } from 'ROOT/logic/objects/geometry/World.jsx';


import { Overlay } from 'ROOT/logic/objects/components/menu/Overlay.jsx';

import { getFrontPlane } from 'ROOT/server/logic/Player';

import { DIRECTION, getMoveMatrix } from 'ROOT/server/logic/Movement';

import 'ROOT/style/objects/components/Camera.less';

import * as crosshair from 'ROOT/resourses/crosshairs/default.svg';


// TODO add PropTypes
// TODO add react-router https://github.com/ReactTraining/react-router
// TODO add pointer following
// TODO add geometry encoder and decoder
// TODO предзагружать во время экрана загрузки текстуры из мира


// looks bad but
let oldDirection;
let oldYdeg;

const showMainContent = (x, y, z, direction, planes) => {
	const xdeg = 0;
	let ydeg;

	if (oldDirection !== undefined) {
		const delta = direction - oldDirection;
		const step = delta === 3 ?
			delta - 4 :
				delta === -3 ?
					delta + 4 :
					delta;
		
		ydeg = oldYdeg + step * 90;
	} else {
		ydeg = direction * 90;
	}

	oldDirection = direction;
	oldYdeg = ydeg;
	
	return (
		<React.Fragment>
			<div className="camera__crosshair-wrap">
				<div className="camera__crosshair">
					<span dangerouslySetInnerHTML={{__html: crosshair}} />
				</div>
			</div>
		
			<div className="camera__viewport">
				<div className="camera__view" style={{transform: `translate3d(0px, 0px, 600px) rotateX(${xdeg}deg) rotateY(${ydeg}deg)` }}>
					<div className="camera__move-plane" style={{transform: `translate3d(${-x * 300}px, ${y * 300}px, ${-z * 300}px)` }}>
						<World />
					</div>
				</div>
			</div>
		</React.Fragment>
    )
}


function showBuildMenuOverlay(addBoardFunction, client) {
	return (
		<Overlay>
			<button
				onClick={
					() => {
						client.writeData({ data: { showBuildMenu: false } })

						const { state: { pos, planes, direction } } = client.readQuery({
						  query: gql`
							  query InitState {
								state @client {
									pos {
										x
										y
										z
									}
								    planes {
							    	    id
									    start {
									    	x
									    	y
									    	z
									    }
									    end {
									    	x
									    	y
									    	z
									    }
									    direction
									    color
									    texture
								    }
									direction
								}
							  }
							`,
						});
						
						const foundPlane = getFrontPlane(planes, direction, pos)
						if (foundPlane) {
							addBoardFunction({
								update: (root, result) => {
									client.writeData({
										data: {
											state: {
												boards: result.data.addBoard,
												__typename: 'State',
											},
										},
									});
								}
							});
						}
					}
				}
			>
				Add new board
			</button>
        </Overlay>
    )
}

function showInventoryOverlay() {
	return (
		<Overlay>
			<span>Inventory</span>
        </Overlay>
    )
}

function showMainMenuOverlay() {
	return (
		<Overlay>
			MAIN MENU!!!
        </Overlay>
    )
}

const AddBoard = gql`
  mutation AddBoard {
    addBoard {
	    id
	    planeId
	    x
	    y
	    links
    }
  }
`;

const InitState = gql`
  query InitState {
    state {
	    pos {
	    	x
	    	y
	    	z
	    }
	    direction
	    planes {
    	    id
		    start {
		    	x
		    	y
		    	z
		    }
		    end {
		    	x
		    	y
		    	z
		    }
		    direction
		    color
		    texture
	    }
	    
	    boards {
    	    id
		    planeId
		    x
		    y
		    links
	    }
    }
    showBuildMenu @client
    moveMatrix @client
    fireballs @client
  }
`;

@withApollo
@graphql(AddBoard, { name: 'addBoard' })
export class Camera extends React.Component {
	render() {
		const {
			client,
			showInventory,
			showMainMenu,

			addBoard,
		} = this.props;

		return (
			<Query query={ InitState }>
				{({ loading, error, data, refetch }) => {
					if (loading) return null;
					if (error) return `Error!: ${error}`;


					console.log('data', data)

					const {
						state: {
							pos: {
								x,
								y,
								z
							},
							direction,
							planes,
							
						},
						showBuildMenu,
					} = data;
					

					// TODO add inited 
					client.writeData({ data: { moveMatrix: getMoveMatrix(planes) } })
					
					return (
						<React.Fragment>
							{ showMainContent(x, y, z, direction, planes) }
			
							{ showMainMenu && showMainMenuOverlay() }
							{ showInventory && showInventoryOverlay() }
							
							{ showBuildMenu && showBuildMenuOverlay(addBoard, client) }
							
						</React.Fragment>
					);
				}}
			</Query>
		);
	}
}

