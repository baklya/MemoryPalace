import { metaDataResolve } from './MetaDataResolver';
import { GraphQLSchema, GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLFloat, GraphQLList } from 'graphql';
import { PubSub, withFilter } from 'graphql-subscriptions';

import { State } from './Store';
import { turnLeft, turnRight, getFrontPlane } from './Player';


import { getMoveFunction } from './Movement';


const pubsub = new PubSub();

function handleAddBoard() {

	const foundPlane = getFrontPlane(State.planes, State.direction, State.pos)

	if (!foundPlane) {
		return State.boards;
	}

	const newBoard = {
		id: 'board_' + Math.random().toString(),
		planeId: foundPlane.id,
		x: 0,
		y: 0,
		links: [],
	};


	console.log('newBoard', newBoard)

	State.boards = [...State.boards, newBoard]


	pubsub.publish('boardAdded', { boardAdded: newBoard, planeId: newBoard.planeId });

	return State.boards;
}





const StateType = new GraphQLObjectType({
	name: 'State',
	fields: () => ({
		pos: { type: PointType },
		direction: { type: GraphQLInt },
		planes: { type: GraphQLList(PlaneType) },
		boards: { type: GraphQLList(BoardType) },
		otherPlayers: { type: GraphQLList(OtherPlayerType) },
	})
});




const OtherPlayerType = new GraphQLObjectType({
	name: 'OtherPlayer',
	fields: () => ({
		pos: { type: PointType },
		direction: { type: GraphQLInt },
	})
});







const PointType = new GraphQLObjectType({
	name: 'Point',
	fields: () => ({
		x: { type: GraphQLFloat },
		y: { type: GraphQLFloat },
		z: { type: GraphQLFloat },
	})
});



const PlaneType = new GraphQLObjectType({
	name: 'Plane',
	fields: () => ({
		id: { type: GraphQLString },
		start: { type: PointType },
		end: { type: PointType },
		direction: { type: GraphQLInt },
		color: { type: GraphQLString },
		texture: { type: GraphQLString },
	})
});

const LinkType = new GraphQLObjectType({
	name: 'Link',
	fields: () => ({
		title: { type: GraphQLString },
		description: { type: GraphQLString },
		image: { type: GraphQLString },
		url: { type: GraphQLString },
		lang: { type: GraphQLString },
	})
});

const BoardType = new GraphQLObjectType({
	name: 'Board',
	fields: () => ({
		id: { type: GraphQLString },
		planeId: { type: GraphQLString },
		x: { type: GraphQLFloat },
		y: { type: GraphQLFloat },
		links: { type: GraphQLList(GraphQLString) },
	})
});


exports.schema = new GraphQLSchema({
	query: new GraphQLObjectType({
		name: 'Query',
		fields: {
			state: {
				type: StateType,
				resolve() {
					return State;
				}
			},
			linkInfo: {
				type: LinkType,
				args: {
					link: { type: GraphQLString },
				},
				resolve(root, { link }) {
					return metaDataResolve(link).then(d => ({
						title: d.title,
						description: d.description,
						image: d.image,
						url: d.url,
						lang: d.lang,
					}));
				}
			},
			boards: {
				type: GraphQLList(BoardType),
				args: {
					id: { type: GraphQLString },
					planeId: { type: GraphQLString },
				},
				resolve(root, { id, planeId }) {
					if (id) {
						return State.boards.filter(b => b.id === id);
					}
					if (planeId) {
						return State.boards.filter(b => b.planeId === planeId);
					}
					return State.boards;
				}
			},
		}
	}),
	mutation: new GraphQLObjectType({
		name: 'Mutation',
		fields: {


			turnLeft: {
				type: StateType,
				resolve() {
					State.direction = turnLeft(State.direction);
					return State;
				}
			},



			turnRight: {
				type: StateType,
				resolve() {
					State.direction = turnRight(State.direction);
					return State;
				}
			},



			move: {
				type: PointType,
				args: {
					moveDirection: { type: GraphQLInt },
				},
				resolve(root, { moveDirection }) {
					
					// TODO validate moveDirection
					const moveFunction = getMoveFunction(moveDirection , State.direction);
					const newPos = moveFunction(State.pos, State._moveMatrix)

					State.pos = newPos;
					return State.pos;
				}
			},




			dragBoard: {
				type: BoardType,
				args: {
					id: { type: GraphQLString },
					x: { type: GraphQLFloat },
					y: { type: GraphQLFloat },
				},
				resolve(root, { id, x, y }) {
					const thisBoard = State.boards.find(b => b.id === id)
					if (thisBoard) {
						thisBoard.x = x;
						thisBoard.y = y;
						return thisBoard;
					}
					return null;
				}
			},
			addLink: {
				type: BoardType,
				args: {
					boardId: { type: GraphQLString },
					link: { type: GraphQLString },
				},
				resolve(root, { boardId, link }) {
					const thisBoard = State.boards.find(b => b.id === boardId)
					if (thisBoard) {
						thisBoard.links.push(link);
						return thisBoard;
					}
					return null;
				}
			},
			clickOnBoard: {
				type: GraphQLList(BoardType),
				args: {
					boardId: { type: GraphQLString },
				},
				resolve(root, { boardId }) {

					console.log('clickOnBoard', boardId)
					const thisBoard = State.boards.find(b => b.id === boardId)
					if (thisBoard) {
						const updatedBoards = State.boards.filter(board => boardId !== board.id);
						State.boards = [...updatedBoards, thisBoard]
						return State.boards;
					}
					return null;
				}
			},

			addBoard: {
				type: GraphQLList(BoardType),
				resolve() {
					console.log('addBoard')
					return handleAddBoard();
				}
			},

		}
	}),

	subscription: new GraphQLObjectType({
		name: 'Subscription',
		fields: {

			boardAdded: {
				type: BoardType,
				args: {
					planeId: { type: GraphQLString },
				},
				//resolve(root, { boardAdded, planeId }) {
				//  console.log('Subscription', planeId)
				//  return boardAdded;
				//},
				subscribe: withFilter(
					() => pubsub.asyncIterator('boardAdded'),
					(payload, variables) => {
						console.log('subscribe fire!', payload, variables)
						return payload.planeId === variables.planeId;
					}
				)


			},

		}
	}),


});

/*

	author: null,
[1]   date: null,
[1]   description:
[1]    'Search the world’s information, including webpages, images, videos and more. Google has many special features to help you find exactly what you’re looking for.',
[1]   image:
[1]    'https://www.google.com/images/branding/googlelogo/1x/googlelogo_white_background_color_272x92dp.png',
[1]   video: null,
[1]   lang: 'en',
[1]   logo: null,
[1]   publisher: null,
[1]   title: 'Google',
[1]   url: 'https://www.google.com/' }
*/
