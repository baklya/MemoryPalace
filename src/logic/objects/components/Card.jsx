import React from 'react';
import 'ROOT/style/objects/components/Card.less';
// TODO add pointer following

export class Card extends React.Component {
	constructor(props) {
		super(props);
		this.state = {front: true};

		this.handleClick = this.handleClick.bind(this);

	}

	componentDidMount() {
	//	new Twitch.Embed("twitch-embed", {
	//		width: 100,
	//		height: 100,
	//		channel: "monstercat"
	//	});
	}


	handleClick() {
		this.setState(prevState => ({
			front: !prevState.front
		}));
	}
	
	render() {
		return (
			<div className={"flip-container" + (this.state.front ? '' : ' hover')} onClick={this.handleClick}>
				<div className="flipper">
					<div className="front">
						FRONT
						<div id="twitch-embed"></div>
					</div>
					<div className="back">
						BACK
					</div>
				</div>
			</div>
		);
	}
}