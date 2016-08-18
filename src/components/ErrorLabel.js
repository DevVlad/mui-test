import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';

class ErrorLabel extends PureComponent {
	static propTypes = {
		errorText: PropTypes.string,
		errorStyle: PropTypes.style
	};

	render() {
		if (this.props.errorText) {
			return (
				<div
					style={{
						...this.props.style,
						...this.props.errorStyle,
						fontFamily: 'Roboto, sans-serif',
						float: 'right',
						position: 'relative',
						width: 'calc(100% - 40px)',
						fontSize: 12 }}
					disabled>
					{ this.props.errorText }
				</div>
			);
		}
		return null;
	}
}

export default ErrorLabel;
