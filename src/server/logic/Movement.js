


export const TILE_SIZE = 300;


export const HORIZONTAL_DIRECTIONS_COUNT = 4;

export const DIRECTION = {
    DOWN: -1,
    NORTH: 0,
    EAST: 1,
    SOUTH: 2,
    WEST: 3,
    UP: 4,
}





export function getMoveMatrix(planes) {
    const moveMatrix = [];
    
    for (let i0 = 0; i0 < planes.length; i0++) {
    	const comp = planes[i0];
    
    	for (let i = Math.min(comp.start.x, comp.end.x) + 1; i <= Math.max(comp.start.x, comp.end.x); i++) {
    		for (let j = Math.min(comp.start.y, comp.end.y); j <= Math.max(comp.start.y, comp.end.y); j++) {
    			for (let k = Math.min(comp.start.z, comp.end.z) + 1; k <= Math.max(comp.start.z, comp.end.z); k++) {
    				let currentIndex = null;
    
    				if (comp.direction == DIRECTION.DOWN) {
    					currentIndex = 0;
    				} else {
    					currentIndex = parseInt(comp.pos)
    				}
    
    				if (currentIndex <= 4) {
    					const indexKey = `${i}$${j}$${k}`;
    					
    					if (moveMatrix.indexOf(indexKey) === -1) {
    					    moveMatrix.push(indexKey);
    					}
    					
    					//if (!moveMatrix[`${i}$${j}$${k}`]) {
    					//	moveMatrix[`${i}$${j}$${k}`] = []
    					//}
    					//moveMatrix[`${i}$${j}$${k}`][currentIndex] = true;
    				}
    			}
    		}
    	}
    }

    return moveMatrix;
}











function getMovePossibilities(x, y, z, moveMatrix) {
		
		
	return moveMatrix.indexOf(`${x}$${y}$${z}`) !== -1;
	// todo check 8 cubes around, then you can understand ability to move 
	
	
	// todo check 4 first
	
	
	// 0 - это между -1 и 0 по х и у, по зет 0 - между и 2 3
	
	//return true;
	//console.log(`${this.state.x}$${this.state.y}$${this.state.z}`)
	//console.log(x, y, z)
	
	
	
	//console.log(moveMatrix[`${this.state.x}$${this.state.y}$${this.state.z + 2}`])
	//console.log(moveMatrix[`${this.state.x}$${this.state.y}$${this.state.z + 3}`])
	
	
	
	//console.log(moveMatrix[`${this.state.x - 1}$${this.state.y}$${this.state.z + 2}`])
	//console.log(moveMatrix[`${this.state.x - 1}$${this.state.y}$${this.state.z + 3}`])
	
	
	//const cube1 = moveMatrix.indexOf(`${x}$${y}$${z - 1}`) !== -1;
	//const cube2 = moveMatrix.indexOf(`${x}$${y}$${z}`) !== -1;
	
	//const cube3 = moveMatrix.indexOf(`${x - 1}$${y}$${z - 1}`) !== -1;
	//const cube4 = moveMatrix.indexOf(`${x - 1}$${y}$${z}`) !== -1;
	

	// условия
	// если есть пол
	// если нет стен перед тобой
	// стена не дает пройти вперед
	
	//const exist = cube1 && cube2 && cube3 && cube4;
	
	//return exist;
	//return exist && cube1[0] && cube2[0] && cube3[0] && cube4[0];
	
	//return moveMatrix[`${this.state.x}$${this.state.y}$${this.state.z}`]
}





function moveNorth(pos, moveMatrix) {
	if (getMovePossibilities(pos.x, pos.y, pos.z - 1, moveMatrix)) {
	    pos.z = pos.z - 1;
	}
	return pos;
}

function moveEast(pos, moveMatrix) {
	if (getMovePossibilities(pos.x + 1, pos.y, pos.z, moveMatrix)) {
	    pos.x = pos.x + 1;
	}
	return pos;
}
	
function moveSouth(pos, moveMatrix) {
	if (getMovePossibilities(pos.x, pos.y, pos.z + 1, moveMatrix)) {
		pos.z = pos.z + 1;
	}
	return pos;
}

function moveWest(pos, moveMatrix) {
	if (getMovePossibilities(pos.x - 1, pos.y, pos.z, moveMatrix)) {
	    pos.x = pos.x - 1;
	}
	return pos;
}

const movesArray = [
	moveNorth,
	moveEast,
	moveSouth,
	moveWest,
];

export function getMoveFunction(moveDirection, faceDirection) {
	return movesArray[(moveDirection + faceDirection) % 4]
}
