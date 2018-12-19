import React from 'react';
import gql from 'graphql-tag';
import { withApollo, graphql } from 'react-apollo';

import { turnLeft, turnRight } from 'ROOT/server/logic/Player';
import { DIRECTION, getMoveFunction } from 'ROOT/server/logic/Movement';

const TURN_LEFT = gql`
	mutation TurnLeft {
	    turnLeft {
	        direction
	    }
	}
`;

const TURN_RIGHT = gql`
	mutation TurnRight {
	    turnRight {
	        direction
	    }
	}
`;


const MOVE = gql`
	mutation Move($direction: Int!) {
	    move(moveDirection: $direction) {
	        x
	        y
	        z
	    }
	}
`;


const mapKeyToDirection = {
	87: DIRECTION.NORTH, // w
	83: DIRECTION.SOUTH, // s
	65: DIRECTION.WEST, // a
	68: DIRECTION.EAST, // d
}


@withApollo
@graphql(TURN_RIGHT, { name: 'turnRight' })
@graphql(TURN_LEFT, { name: 'turnLeft' })
@graphql(MOVE, { name: 'move' })
export class KeyboardHandler extends React.Component {
	constructor(props) {
		super(props);

		this._handleKeyDown = (event) => {
			const { client } = this.props;
			const t = event.target;
			
			const isInputText = t && t instanceof HTMLInputElement && t.type == 'text';
			
			if (isInputText) {
				return;
			}
			
			if (event.which === 27) {
				// esc - main menu
				
				return;
			}
			
			if (event.which === 13) {
				// enter - main menu
				
				return;
			}

			if (event.which === 32) { // space - fireball
				// TODO spawn fireball
				const { state: { pos, direction }, fireballs } = client.readQuery({
				  query: gql`
					  query InitState {
						state @client {
							pos {
								x
								y
								z
							}
							direction
						}
						fireballs @client
					  }
					`,
				});
				
				
				console.log('fireballs', fireballs)
				
				const newFireballs = [...fireballs, '123']
				
				
				console.log('newFireballs', newFireballs)
				
				//id: "$ROOT_QUERY.linkInfo({"link":"google.com"})"
//type: "id"
//typename: "Link"
				
				client.writeData({ data: { fireballs: newFireballs } })
				
				return;
			}




			if (event.which === 66) { // b - build menu
				const { showBuildMenu } = client.readQuery({
				  query: gql`
					  query InitState {
					    showBuildMenu @client
					  }
					`,
				});

				client.writeData({ data: { showBuildMenu: !showBuildMenu } })
				return;
			}

			if (event.which === 81) { // q
				const { state: { direction } } = client.readQuery({
				  query: gql`
					  query InitState {
						state @client {
							direction
						}
					  }
					`,
				});
				client.writeData({
					data: {
						state: {
							direction: turnLeft(direction),
							__typename: 'State',
						},
					}
				})
				this.props.turnLeft();
				return;
			}


			if (event.which === 69) { // e
			const { state: { direction } } = client.readQuery({
				  query: gql`
					  query InitState {
						state @client {
							direction
						}
					  }
					`,
				});
				client.writeData({
					data: {
						state: {
							direction: turnRight(direction),
							__typename: 'State',
						},
					}
				})
				this.props.turnRight();
				return;
			}



			if (mapKeyToDirection.hasOwnProperty(event.which)) { // wasd
			const { state: { pos, direction }, moveMatrix } = client.readQuery({
				  query: gql`
					  query InitState {
						state @client {
							pos {
								x
								y
								z
							}
							direction
						}
						moveMatrix @client
					  }
					`,
				});


				const moveDirection = mapKeyToDirection[event.which];

				const moveFunction = getMoveFunction(moveDirection, direction);
				const newPos = moveFunction(pos, moveMatrix)
				client.writeData({
					data: {
						state: {
							pos: newPos,
							__typename: 'State',
						},
					}
				});
				
				this.props.move({
				variables: {
					direction: moveDirection,
				},
				//optimisticResponse: {
				//	__typename: 'Mutation',
				//	dragBoard: {
				//		__typename: 'Board',
				//		id: this.props.id,
				//		x: drag.x,
				//		y: drag.y,
				//	},
				//},
			})
				
				return;
			}





			/*
				73 - i
				66 - b
				
				87 - w
				83 - s
				65 - a
				68 - d

				81 - q
				69 - e

				39 - arrow right
				37 - arrow left
				38 - arrow up
				40 - arrow down
			*/
			if (event.which > 0) {
				// key pressed action
				console.log('!!!!!!!!!!!!!', event.which)
				
				//this.props.keyDown(event.which);
				
				return;
			}

		}
	}

	componentDidMount() {
		document.addEventListener("keydown", this._handleKeyDown);
	}

	componentWillUnmount() {
		document.removeEventListener("keydown", this._handleKeyDown);
	}

	render() {
		return (
			<div/>
		);
	}
}
