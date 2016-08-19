import React, { PropTypes } from 'react';
import Toggle from 'material-ui/Toggle';
import TextFieldUnderline from 'material-ui/TextField';

import { transformProps } from './utils/material.js';
import PureComponent from 'react-pure-render/component';

class ToggleInput extends PureComponent{
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
		labelPosition: "right"
	};

	handleError(notifications) {
		if (notifications) {
			return (
				<TextFieldUnderline
					id="ToggleInput_defaultAlias_UnderlineForNotify"
					{ ...transformProps(TextFieldUnderline, notifications) }
					style={ {
						fontSize: 12,
						transform: 'translate(46px, -20px)',
						width: '0px',
						height:'0px'
					} }
					disabled
				/>
			);
		}
	}

	render() {
		const { errorText, warnText, passText, ...restProps } = this.props;
		return (
			<div>
				<Toggle
					{...restProps}
					{ ...transformProps(Toggle, restProps) }
					value={this.props.value}
					onBlur={ () => this.props.onBlur(this.props.value) }
					onToggle={ () => this.props.onChange(!this.props.value) }
				/>
				{ this.handleError({errorText, warnText, passText}) }
			</div>
		);
	}
}

export default ToggleInput;
