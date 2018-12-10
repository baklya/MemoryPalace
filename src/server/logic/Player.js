

import { HORIZONTAL_DIRECTIONS_COUNT } from './Movement';


export function turnLeft(currentDirection) {
    const nextDirection = currentDirection - 1;
    return nextDirection < 0 ? HORIZONTAL_DIRECTIONS_COUNT + nextDirection : nextDirection
}

export function turnRight(currentDirection) {
    const nextDirection = currentDirection + 1;
    return nextDirection % HORIZONTAL_DIRECTIONS_COUNT;
}




export function getFrontPlane(planes, searchPlaneDirection, userPos) {
	let foundPlane = null;
	for (let i0 = 0; i0 < planes.length; i0++) {
		const comp = planes[i0];
		if (comp.direction === searchPlaneDirection) {
			if (comp.direction % 2 === 0) {
				if (Math.min(comp.start.x, comp.end.x) <= userPos.x && userPos.x <= Math.max(comp.start.x, comp.end.x)) {
					foundPlane = comp;
					break;
				}
			}
			if (comp.direction % 2 === 1) {
				if (Math.min(comp.start.z, comp.end.z) <= userPos.z && userPos.z <= Math.max(comp.start.z, comp.end.z)) {
					foundPlane = comp;
					break;
				}
			}
		}
	}

    return foundPlane;
}