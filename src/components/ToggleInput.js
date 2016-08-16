import React, { PropTypes } from 'react';
import Toggle from 'material-ui/Toggle';
import TextFieldUnderline from 'material-ui/TextField';
import transitions from 'material-ui/styles/transitions.js';

import { transformProps } from './utils/material.js';

const styles = {
	block: {
		maxWidth: 250,
	},
	toggle: {
		marginBottom: 100,
	},
};

class ToggleInput extends React.Component{
	static propTypes = {
		label: PropTypes.string,
		onBlur: PropTypes.func,
		onChange: PropTypes.func,
		value: PropTypes.bool,
		warnText: PropTypes.string,
		errorText: PropTypes.string,
	};

	static defaultProps = {
		onChange: () => {},
		onBlur: () => {},
		value: false,
		labelPosition: "right"
	};

	handleError() {
		if (this.props.errorText || this.props.warnText) {
			return (
				<TextFieldUnderline
					{ ...transformProps(TextFieldUnderline, this.props) }
					style={ {
						fontSize: 12,
						transition: transitions.easeOut(),
						transform: 'translate(46px, -60px)',
						width: '0px',
					} }
					disabled
				/>
			);
		}
	}

	render() {
		const { value, ...restProps } = this.props;
		return (
			<div style={styles.block}>
				<Toggle
					{...restProps}
					defaultToggled={ value }
					style={ styles.toggle }
					onBlur={ () => this.props.onBlur(this.props.value) }
					onToggle={ () => this.props.onChange(!this.props.value) }
				/>
				{ this.handleError() }
			</div>
		);
	}

};

export default ToggleInput;
