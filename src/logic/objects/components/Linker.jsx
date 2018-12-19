import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import 'ROOT/style/objects/components/Linker.less';

export const LINK_QUERY = gql`
	query l($link: String!) {
	  linkInfo(link: $link) {
	    url
	    title
	    description
	    image
	    logo
	    publisher
	  }
	}
`;

// TODO add apply link to board - youtube board, twitch etc 

export class Linker extends React.Component {
	render() {
		console.log('render link')
		
		const { link } = this.props;
		return (
			<Query query={ LINK_QUERY } variables={{ link: link }}>
				{({ loading, error, data }) => {
					if (loading) return null;
					if (error) return `Error!: ${error}`;
					
					console.log(data.linkInfo)
					
					return (
						<div className="linker__container">
							
							<a className="linker__link" href={ data.linkInfo.url } target="_blank">
								<div className="linker__title">
									{
										data.linkInfo.logo && (
											<img className="linker__logo" src={ data.linkInfo.logo } />
										)
									}
									{ data.linkInfo.title }
								</div>
							</a>


							<button>Apply</button>

							<div className="linker__content">
								<div className="linker__description">
									{ data.linkInfo.description }
								</div>

								<a className="linker__link" href={ data.linkInfo.url } target="_blank">
									<img className="linker__image" src={data.linkInfo.image} />
								</a>


								

							</div>

						</div>
					);
				}}
			</Query>
		);
	}
}
