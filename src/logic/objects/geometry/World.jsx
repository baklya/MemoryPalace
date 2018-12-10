import React from 'react';
import gql from 'graphql-tag';

import { Query } from 'react-apollo';

import { FireBall } from 'ROOT/logic/objects/components/FireBall.jsx';

import { Plane } from 'ROOT/logic/objects/geometry/general/Plane.jsx';

const GET_PLANES = gql`
{
	state @client {
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
	}
	
	fireballs @client
}
`;


export class World extends React.Component {
	render() {
		console.log('render world')
		
		// TODO кажется каждое действие вызывает ререндер, нужно проверять
		
		// TODO вместо item.content используем отдельное хранилище, делаем поиск в нем по id

		return (
			<div className="world__container" style={{ transformStyle: 'preserve-3d' }}>
				  <Query query={GET_PLANES}>
				    {({ data }) => (
				    	<React.Fragment>
				    		{
				    			data.state.planes.map((item) => {
									return <Plane
										key={ item.id }
										id={ item.id }
										start={ item.start }
										end={ item.end }
										direction={ item.direction }
										color={ item.color }
										texture={ item.texture }
										text={item.text}
									/>
					        	})
				    		}
				    		
				    		{
				    			data.fireballs.map((fb, index) => {
									return <FireBall
										key={ index }
									/>
					        	})
				    		}
				    		
				    		
							
				    	</React.Fragment>
		        	)}
				  </Query>
			</div>
		);
	}
}
