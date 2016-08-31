import React, { PropTypes } from 'react';
import PureComponent from 'react-pure-render/component';
import stylePropType from 'react-style-proptype';

class ErrorLabel extends PureComponent {
	static propTypes = {
		errorText: PropTypes.string,
		// errorStyle: PropTypes.style
		errorStyle: stylePropType
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
