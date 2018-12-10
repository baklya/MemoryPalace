import React from 'react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';

import 'ROOT/style/objects/components/Linker.less';

const LinkQuery = gql`
	query l($link: String!) {
	  linkInfo(link: $link) {
	    url
	    title
	    description
	    image
	  }
	}
`;

export class Linker extends React.Component {
	render() {
		console.log('render link')
		
		const { link } = this.props;
		return (
			<Query query={ LinkQuery } variables={{ link: link }}>
				{({ loading, error, data }) => {
					if (loading) return null;
					if (error) return `Error!: ${error}`;
					
					return (
						<div className="linker__container">
							<a className="linker__link" href={ data.linkInfo.url } target="_blank">
								{ data.linkInfo.url }
							</a>

							<div className="linker__content">
								<div className="linker__title">
									{ data.linkInfo.title }
								</div>
								<img className="linker__image" src={data.linkInfo.image} />
							</div>

						</div>
					);
				}}
			</Query>
		);
	}
}
