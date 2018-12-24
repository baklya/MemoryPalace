import React from 'react';
import gql from 'graphql-tag';
import { withApollo } from 'react-apollo';


import * as THREE from 'three';




import { DIRECTION } from 'ROOT/server/logic/Movement';

import { getFrontPlane } from 'ROOT/server/logic/Player';


import * as explosion from 'ROOT/resourses/sprites/explosion.png';

import * as vertexShader from 'ROOT/logic/shaders/vertexShader.glsl';
import * as fragmentShader from 'ROOT/logic/shaders/fragmentShader.glsl';

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
        
        this.fireballContainer = React.createRef();

        
        
        // todo play blow animation on wall, then destroy this object
        
    }
    
    
    
    
	componentDidMount() {
		this._start = Date.now();
		
	    this._camera = new THREE.PerspectiveCamera( 70, 1, 1, 10000 );
	    this._camera.position.z = 100;
		this._camera.target = new THREE.Vector3( 0, 0, 0 );
	 
	 
	    this._scene = new THREE.Scene();

	    this._material = new THREE.ShaderMaterial( {
			uniforms: {
				tExplosion: { type: "t", value: THREE.ImageUtils.loadTexture( explosion ) },
				time: { type: "f", value: 0.0 },
				weight: { type: "f", value: 10.0 }
			},
			vertexShader: vertexShader,
			fragmentShader: fragmentShader
		} );
	    
	    this._mesh = new THREE.Mesh( new THREE.IcosahedronBufferGeometry( 20, 5 ), this._material );


	    this._scene.add( this._mesh );
	 
	    this._renderer = new THREE.WebGLRenderer( { antialias: true, alpha: true } );
	    this._renderer.setSize( 200, 200 );
	    this._renderer.autoClear = false;
	    
	    this.fireballContainer.current.appendChild( this._renderer.domElement );
	    

	    const animate = () => {
		    requestAnimationFrame( animate );

			this._material.uniforms[ 'time' ].value = .00025 * ( Date.now() - this._start );

		    this._renderer.render( this._scene, this._camera );
		}
	    animate();
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	    
	}

    // todo start point and direction

    //transition-duration: 0.2s;
    
    //transform: translate3d(-600px, -300px, 0px) rotateX(0deg) rotateY(0deg);
    //<div className="camera__move-plane" style={{transform: `translate3d(${-x * 300}px, ${y * 300}px, ${-z * 300}px)` }}>
	render() {
        const {x, y, z, dur, direction} = this.state;


		//const d = 1000;

		return (
			<div ref={ this.fireballContainer } className="fireball__container" style={
			    {
			        transform: `translate3d(${x * 300}px, ${y * 300}px, ${z * 300}px) ${direction % 2 === 1 ? ' rotateY(90deg)' : ''}`,
			        transitionDuration: `${ dur }s`
			    }
			}/>
		);
	}
}
