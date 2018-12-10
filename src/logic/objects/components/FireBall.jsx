import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';


import { DIRECTION } from 'ROOT/server/logic/Movement';

import { getFrontPlane } from 'ROOT/server/logic/Player';

import 'ROOT/style/objects/components/FireBall.less';



@withApollo
export class FireBall extends React.Component {
    
    
    constructor(props) {
        super(props);
        
		const { state: { planes, pos, direction } } = this.props.client.readQuery({
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
	    
        
        this.state = {
            x: pos.x,
            y: pos.y,
            z: pos.z,
            dur: 0,
            direction: direction
        }
        
        
		const foundPlane = getFrontPlane(planes, direction, pos)
		if (foundPlane) {
		    
		    
		    console.log('foundPlane', foundPlane.start.z)
		    

		    if (direction === DIRECTION.NORTH) {
                setTimeout(() => {
                    this.setState({
                        z: foundPlane.start.z - 1,
                        dur: (Math.abs(foundPlane.start.z - 1 - this.state.z)) * 0.5
                    })
                }, 100);
		    } else if (direction === DIRECTION.SOUTH) {
		        setTimeout(() => {
                    this.setState({
                        z: foundPlane.start.z + 2,
                        dur: (Math.abs(foundPlane.start.z + 2 - this.state.z)) * 0.5
                    })
                }, 100);
		    } else if (direction === DIRECTION.EAST) {
		        setTimeout(() => {
                    this.setState({
                        x: foundPlane.start.x + 2,
                        dur: (Math.abs(foundPlane.start.x + 2 - this.state.x)) * 0.5
                    })
                }, 100);
		    } else if (direction === DIRECTION.WEST) {
		        setTimeout(() => {
                    this.setState({
                        x: foundPlane.start.x - 1,
                        dur: (Math.abs(foundPlane.start.x - 1 - this.state.x)) * 0.5
                    })
                }, 100);
		    }

		    


		}
        
        

        
        
        // todo play blow animation on wall, then destroy this object
        
    }
    
    // todo start point and direction
    
    
    //transition-duration: 0.2s;
    
    //transform: translate3d(-600px, -300px, 0px) rotateX(0deg) rotateY(0deg);
    //<div className="camera__move-plane" style={{transform: `translate3d(${-x * 300}px, ${y * 300}px, ${-z * 300}px)` }}>
	render() {
        const {x, y, z, dur, direction} = this.state;
	    
	    
		return (
			<div className="fireball__container" style={
			    {
			        transform: `translate3d(${x * 300}px, ${y * 300}px, ${z * 300}px) ${direction % 2 === 1 ? ' rotateY(90deg)' : ''}`,
			        transitionDuration: `${dur}s`
			    }
			    
			}/>
		);
	}
}
