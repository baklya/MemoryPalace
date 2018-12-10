import React from 'react';
import ReactDOM from 'react-dom';

import 'ROOT/style/objects/components/menu/Overlay.less';

// TODO transparent UI element

const modalRoot = document.body;

export class Overlay extends React.Component {
	  constructor(props) {
	    super(props);
	    this.el = document.createElement('div');
	    this.el.className = 'overlay__container';
	  }
	
	  componentDidMount() {
	    modalRoot.appendChild(this.el);
	  }
	
	  componentWillUnmount() {
	    modalRoot.removeChild(this.el);
	  }
	
	  render() {
	  	console.log('render overlay')
	    return ReactDOM.createPortal(
	  		<React.Fragment>
				{ this.props.children }
			</React.Fragment>,
	      this.el,
	    );
	  }
}
