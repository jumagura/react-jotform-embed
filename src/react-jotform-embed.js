const React = require('react'); //eslint-disable-line no-unused-vars
const ReactDOM = require('react-dom');
const PropTypes = require('prop-types');
import autobind from 'autobind-decorator';

const iframeStyle = {
	width: '100%',
	height: '300px'
};

class JobformEmbed extends React.Component {
	static propTypes = {
		src: PropTypes.string.isRequired,
	};
	
	@autobind
	handleIframeMessage(e) {
		const props = this.props;
		const args = e.data.split(':');
		const formId = args[2];
		const iframe = ReactDOM.findDOMNode(this.refs.iframe);
		if (!!iframe && props.src.endsWith(formId)) {
			switch (args[0]) {
				case 'scrollIntoView':
					iframe.scrollIntoView();
					break;
				case 'setHeight':
					iframe.style.height = `${args[1]}px`;
					break;
				case 'collapseErrorPage':
					if (iframe.clientHeight > global.innerHeight) {
						iframe.style.height = `${global.innerHeight}px`;
					}
					break;
				case 'reloadPage':
					global.location.reload();
					break;
			}
			var isJotForm = (e.origin.indexOf('jotform') > -1);
			if (isJotForm && 'contentWindow' in iframe && 'postMessage' in iframe.contentWindow) {
				var urls = {
					'docurl': encodeURIComponent(global.document.URL),
					'referrer': encodeURIComponent(global.document.referrer)
				};
				iframe.contentWindow.postMessage(JSON.stringify({'type': 'urls', 'value': urls}), '*');
			}
		}
	}
	
	componentDidMount() {
		if (global.addEventListener) {
			global.addEventListener('message', this.handleIframeMessage, false);
		}
		else if (global.attachEvent) {
			global.attachEvent('onmessage', this.handleIframeMessage);
		}
	}
	
	componentWillUnmount() {
		if (global.removeEventListener) {
			global.removeEventListener('message', this.handleIframeMessage, false);
		}
		else if (global.detachEvent) {
			global.detachEvent('onmessage', this.handleIframeMessage);
		}
	}
	
	render() {
		const props = this.props;
		return (
			<iframe ref="iframe" style={iframeStyle} className={props.className} allowTransparency="true" src={props.src} frameBorder={0} />
		);
	}
	
	shouldComponentUpdate(nextProps) {
		const props = this.props;
		return props.src !== nextProps.src || props.className !== nextProps.className;
	}
}

module.exports = JobformEmbed;
