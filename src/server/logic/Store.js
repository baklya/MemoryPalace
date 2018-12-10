import { DIRECTION } from './Movement';

const planes = [{
		id: 'defaultPlane1',
		start: { x: -2, y: 0, z: 0 },
		end: { x: 3, y: -2, z: 0 },
		direction: DIRECTION.NORTH,
		texture: 'bricks',
	},
	{
		id: 'defaultPlane2',
		start: { x: -2, y: 0, z: 7 },
		end: { x: 3, y: -2, z: 7 },
		direction: DIRECTION.SOUTH,
		texture: 'bricks',
	},
	{
		id: 'defaultPlane3',
		start: { x: 3, y: 0, z: 0 },
		end: { x: -2, y: 0, z: 7 },
		direction: DIRECTION.DOWN,
		texture: 'hexagonal'

	},
	{
		id: 'defaultPlane4',
		start: { x: -2, y: 0, z: 0 },
		end: { x: -2, y: -2, z: 7 },
		direction: DIRECTION.WEST,
		texture: 'bricks',
	},
	{
		id: 'defaultPlane5',
		start: { x: 3, y: 0, z: 0 },
		end: { x: 3, y: -2, z: 7 },
		direction: DIRECTION.EAST,
		texture: 'bricks',
	},


	{
		id: 'defaultPlane6',
		start: { x: 3, y: -2, z: 0 },
		end: { x: -2, y: -2, z: 7 },
		direction: DIRECTION.UP,
		color: 'aliceblue',
		texture: 'wood-planks'
	},

];

// TODO change to hash tables

const boards = [{
		id: 'defaultBoard1',
		planeId: 'defaultPlane1',
		x: 100,
		y: 300,
		links: ['google.com'],
	},
	{
		id: 'defaultBoard2',
		planeId: 'defaultPlane2',
		x: 0,
		y: 0,
		links: [],
	},
];


exports.State = {
	pos: {
		x: 0,
		y: 0,
		z: 3,
	},

	direction: DIRECTION.NORTH,

	planes: planes,
	boards: boards,
	otherPlayers: [],
};
