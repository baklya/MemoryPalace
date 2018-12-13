import React from 'react';

import { graphql, withApollo } from 'react-apollo';
import gql from 'graphql-tag';


import { DIRECTION } from 'ROOT/server/logic/Movement';

import { Scrollbars } from 'react-custom-scrollbars';
import DraggableCore from 'ROOT/logic/_libs/react-draggable';


import { PlaneContext, BoardQuery, BOARD_QUERY2 } from 'ROOT/logic/objects/geometry/general/Plane.jsx';
import { Linker } from 'ROOT/logic/objects/components/Linker.jsx';
import { Overlay } from 'ROOT/logic/objects/components/menu/Overlay.jsx';

import 'ROOT/style/objects/components/Board.less';





const DragBoard = gql `
  mutation DragBoard($id: String!, $x: Float!, $y: Float!) {
    dragBoard(id: $id, x: $x, y: $y) {
	    id
	    x
	    y
    }
  }
`;

const AddLink = gql `
  mutation AddLink($boardId: String!, $link: String!) {
    addLink(boardId: $boardId, link: $link) {
	    id
	    links
    }
  }
`;


const ClickOnBoard = gql `
  mutation ClickOnBoard($boardId: String!) {
    clickOnBoard(boardId: $boardId) {
	    id
    }
  }
`;



//const BoardQuery = gql`
//	query BoardQuery($id: String!) {
//	  boards(id: $id) {
//	    id
//	    x
//	    y
//	  }
//	}
//`;

//console.log(BoardQuery)

// TODO add add new card feature
// TODO rotate wall 


// TODO add iframe with https://awwapp.com/

// todo добавить значение отступа от стены

// TODO добавить https://github.com/mzabriskie/react-draggable
//https://www.npmjs.com/package/re-resizable

// TODO https://www.npmjs.com/package/metascraper



@withApollo
@graphql(ClickOnBoard, { name: 'clickOnBoard' })
@graphql(AddLink, { name: 'addLink' })
@graphql(DragBoard, { name: 'dragBoard' })
//@connect(mapStateToProps, mapDispatchToProps)
export class Board extends React.Component {
	constructor(props) {
		super(props);
		this.state = {

			//	color: props.color,

			//id: Math.random() + '',


			//	links: [],
			//showOverlay: false,


			showAddLinkDialog: false,

		};





		this._handleDrag = (e, drag) => {
			//console.log('_handleDrag', drag.x, drag.y)
			//drag.x = drag.x*20;
			//console.log('_handleDrag', drag)

			//e.preventDefault();
			//e.stopPropagation();
			//drag.deltaX = drag.deltaX * 2
			//drag.deltaY = drag.deltaY * 2
			// TODO правильно мапим драг с учетом расстояния
			// TODO сейвим в сторадж положение


			//return true
			//this.setState({
			//	x: 200,
			//	y: 300,
			//})


		}

		this._handleStop = (e, drag) => {
			//console.log('_handleStop', drag)


			//drag.deltaX = drag.deltaX * 2
			//drag.deltaY = drag.deltaY * 2
			// TODO правильно мапим драг с учетом расстояния
			// TODO сейвим в сторадж положение
			//this.setState({
			//	x: drag.x,
			//	y: drag.y,
			//})




			this.props.dragBoard({
				variables: {
					id: this.props.id,
					x: drag.x,
					y: drag.y,
				},
				optimisticResponse: {
					__typename: 'Mutation',
					dragBoard: {
						__typename: 'Board',
						id: this.props.id,
						x: drag.x,
						y: drag.y,
					},
				},
			})

		}


		this._customXYCalc = (planeStart, planePos) => {



			// TODO get user pos

			const { client } = this.props;

			const { state: { pos } } = client.readQuery({
			  query: gql`
				  query InitState {
					state @client {
						pos {
							x
							y
							z
						}
					}
				  }
				`,
			});


			console.log('pos', pos)


			// TODO учитывать углы камеры
			// TODO учитывать, что пользователь может передвигаться с драгом, нужно перемещать окно в правильное место или фиксить такое поведение

			let distance;
			switch (planePos) {
				case DIRECTION.SOUTH:
					distance = Math.abs(1 + planeStart.z - pos.z);

					break;
				case DIRECTION.NORTH:
					//xdeg, ydeg

					// при наклонах - есть какая-то зависимость от центра камеры 


					distance = Math.abs(planeStart.z - pos.z);
					console.log(planeStart.z, pos.z)

					break;
				case DIRECTION.WEST:

					distance = Math.abs(planeStart.x - pos.x);

					break;
				case DIRECTION.EAST:
					//right = Math.abs(planeStart.z - palneEnd.z) * TILE_SIZE - BOARD_SIZE;
					distance = Math.abs(1 + planeStart.x - pos.x);

					break;
			}


			return (x, y) => {
				const PERSP = 600;
				const TILE_SIZE = 300;



				// TODO проработать драг для всех положений плоскостей и камер
				// 6 - plane z pos for north

				//const a = 1;
				//const b = 1;



				//const e = Math.sqrt(1 - b*b / a*a)

				const coeff = distance * TILE_SIZE / PERSP; // * e;


				return {
					x: x * coeff,
					y: y * coeff,
				}
			}


		}


		this._getContainerBounds = (planeStart, palneEnd, planePos) => {
			const BOARD_SIZE = 300;
			const TILE_SIZE = 300;
			// для разных положений нужно использовать разные оси 


			let right;
			switch (planePos) {
				case DIRECTION.SOUTH:
				case DIRECTION.NORTH:
					right = Math.abs(planeStart.x - palneEnd.x) * TILE_SIZE - BOARD_SIZE;
					break;
				case DIRECTION.WEST:
				case DIRECTION.EAST:
					right = Math.abs(planeStart.z - palneEnd.z) * TILE_SIZE - BOARD_SIZE;
					break;
			}



			return { top: 0, left: 0, right: right, bottom: Math.abs(planeStart.y - palneEnd.y) * TILE_SIZE - BOARD_SIZE }
		}


		this._boardClick = () => {
			//this.props.clickOnBoard(this.props.id)

			const { client } = this.props;
			const { state: { boards } } = client.readQuery({
			  query: gql`
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
				`,
			});


			const boardId = this.props.id;
			const thisBoard = boards.find(board => boardId === board.id);
			if (thisBoard) {
				const updatedBoards = boards.filter(board => boardId !== board.id);
				
				client.writeData({
					data: {
						state: {
							boards: [...updatedBoards, thisBoard],
							__typename: 'State',
						},
					} 
				});
				this.props.clickOnBoard({
					variables: {
						boardId: boardId,
					},
					

					//optimisticResponse: {
					//	__typename: 'Mutation',
					//	addLink: {
					//		__typename: 'Board',
					//		id: this.props.id,
					//		links: this.props.links.concat(this._linkInputValue.trim()),
					//	},
					//},
					
					//refetchQueries: [
					//	{
					//		query: BoardQuery,
					//		variables: { planeId: thisBoard.planeId }
					//	}
					//]
				})
				
				//const updatedBoards = boards.filter(board => boardId !== board.id);
				//client.writeData({
				//	data: {
				//		state: {
				//			boards: [...updatedBoards, thisBoard],
				//			__typename: 'State',
				//		},
				//	} 
				//});
				
			}
		}

		this._showAddLinkDialog = () => {
			if (this.state.showAddLinkDialog) {
				return (
					<Overlay>
						<span>Add link</span>
						
						<input name="link" type="text" onChange={ this._linkInputChange }/>
						
						<button onClick={this._addLink}>Submit</button>
			        </Overlay>
				)
			}
		}

		this._linkInputChange = (e) => {
			this._linkInputValue = e.target.value;
		}



		this._addLink = () => {


			// todo Add modal UI to interact with user, for example input field
			// We can add preview to this modal dialog, where user can customize link as he wants
			// user clicks on add button -> input modal -> link is added to board


			if (this._linkInputValue && this._linkInputValue.trim()) {


				this.props.addLink({
					variables: {
						boardId: this.props.id,
						link: this._linkInputValue.trim(),
					},
					optimisticResponse: {
						__typename: 'Mutation',
						addLink: {
							__typename: 'Board',
							id: this.props.id,
							links: this.props.links.concat(this._linkInputValue.trim()),
						},
					},
				})









				//this.props.addLink({
				//	boardId: this.props.id,
				//	link: this._linkInputValue.trim(),
				//})
				//this.state.links.push(this._linkInputValue.trim());

			}
			this.setState({
				showAddLinkDialog: false,
			})
		}


		this._handleKeyDown = (event) => {
			//const t = event.target;
			//const isInputText = t && t instanceof HTMLInputElement && t.type == 'text';
			//if (!isInputText) {
			//	return;
			//}

			const { showAddLinkDialog } = this.state;


			// TODO нужно единую точку обработки клавиатуры
			if (event.which === 27) { // esc - main menu

				if (showAddLinkDialog) {
					event.stopPropagation()
					this.setState({
						showAddLinkDialog: false,
					})
				}

				return;
			}


		}


	}



	componentDidMount() {
		document.addEventListener("keydown", this._handleKeyDown);
	}

	_calculatePos(planeStart, palneEnd, planePos) {
		const TILE_SIZE = 300;
		const OFFSET = 2;

		// TODO есть универсальность, вероятно, что в разных положениях свапаются x и y



		const xFromLeft = planePos === DIRECTION.NORTH;
		const zFromLeft = planePos === DIRECTION.WEST;

		const topLeftPos = {
			x: (xFromLeft ? Math.min : Math.max)(planeStart.x, palneEnd.x),
			y: Math.min(planeStart.y, palneEnd.y),
			z: (zFromLeft ? Math.max : Math.min)(planeStart.z, palneEnd.z),
		}

		let xdeg = 0;
		let ydeg = 0;

		let xpx = topLeftPos.x * TILE_SIZE;
		let ypx = topLeftPos.y * TILE_SIZE;
		let zpx = topLeftPos.z * TILE_SIZE;

		switch (planePos) {
			case DIRECTION.SOUTH:
				ydeg = 180;

				xpx += TILE_SIZE;
				zpx += TILE_SIZE - OFFSET;
				break;
			case DIRECTION.WEST:
				ydeg = 90

				xpx += OFFSET;
				zpx += TILE_SIZE;
				break;
			case DIRECTION.NORTH:
				zpx += OFFSET;
				break;
			case DIRECTION.EAST:
				ydeg = -90

				xpx += TILE_SIZE - OFFSET;
				break;
		}

		const translate3d = `translate3d(${xpx}px, ${ypx}px, ${zpx}px)`
		const rotate = `rotateX(${xdeg}deg) rotateY(${ydeg}deg)`

		return `${translate3d} ${rotate}`;
	}





	_addLinkClick() {
		this._linkInputValue = '';
		this.setState({
			showAddLinkDialog: true,
		})
	}

	render() {
		const { x, y, links } = this.props;

		// TODO можно сделать только установку начала координат через див верхнего уровня, а ниже уже будут драгблы


		return (
			<PlaneContext.Consumer>
				{(context) => {
					const calculatedPos = this._calculatePos(context.start, context.end, context.pos);
					
					const customXYCalc = this._customXYCalc(context.start, context.pos);
					

					return (
					
					
			
						<div id={this.props.id} onMouseDown={this._boardClick} className="board__outer-container"  style={{ transform: calculatedPos }}>

							  { this._showAddLinkDialog() }

						      <DraggableCore
						        //axis="x"
						        //disabled={true}
						        handle=".board__header"
						        //defaultPosition={{x: x, y: y}}
						        position={{x: x, y: y}}
						        //bounds={ this._getContainerBounds(context.start, context.end, context.pos) }
						        //grid={[25, 25]}
						        //onStart={this.handleStart}
						        onDrag={ this._handleDrag }
						        onStop={ this._handleStop }
						        customXYCalc={ customXYCalc }
						        >

									<div className="board__container">
										<div className="board__header">Title</div>
									
										<div className="board__header-tools">
											<button className="board__button" onClick={this._addLinkClick.bind(this)}>+</button>
										</div>
									
										<div className="board__content">
											<Scrollbars autoHide>
										
												<div style={{width: '100%', height: '100%'}} >
													{ links.map((link, index) =>
													    <Linker key={ index } link={link}></Linker>
													 ) }
												</div>
											
											</Scrollbars>
											
										</div>
										
									</div>
						      </DraggableCore>
					

						</div>
					
					
					

					
					
					

					);
				}}
			</PlaneContext.Consumer>
		);
	}


}
