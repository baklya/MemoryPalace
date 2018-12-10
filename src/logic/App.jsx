import React from 'react';

import { KeyboardHandler } from 'ROOT/logic/objects/components/KeyboardHandler.jsx';

import { Camera } from 'ROOT/logic/objects/components/Camera.jsx';



export class App extends React.Component {
	render() {
		return (
			<React.Fragment>
				<KeyboardHandler />
				<Camera />
			</React.Fragment>
		);
	}
}

