import React, { PropTypes } from 'react';
import RadioButton from 'material-ui/RadioButton';
import Checkbox from 'material-ui/Checkbox';
import TextFieldUnderline from 'material-ui/TextField';
import UncheckedIconDefault from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import CheckedIconDefault from 'material-ui/svg-icons/toggle/check-box';
import PureComponent from 'react-pure-render/component';

import { transformProps } from './utils/material.js';

class CheckboxInput extends PureComponent{
	static propTypes = {
		label: PropTypes.string,
		checkedIcon: PropTypes.object,
		uncheckedIcon: PropTypes.object,
		onChange: PropTypes.func,
		onBlur: PropTypes.func,
		value: PropTypes.bool,
		errorText: PropTypes.string,
		warnText: PropTypes.string,
	};

	static defaultProps = {
		onChange: () => {},
		onBlur: () => {},
		value: false,
		labelPosition: "right"
	};

	handleError(notifications) {
		if (notifications) {
			return (
				<TextFieldUnderline
					id="CheckboxInput_defaultAlias_UnderlineForNotify"
					{ ...transformProps(TextFieldUnderline, notifications) }
					style={ {
						fontSize: 12,
						transform: 'translate(42px, -20px)',
						width: '0px',
						height: '0px'
					} }
					disabled
				/>
			);
		}
	}

	_handleClick = () => {
		this.props.onChange(!this.props.value);
	};

	render() {
		const { errorText, warnText, passText, ...restProps } = this.props;
		return (
			<div>
					<Checkbox
						{ ...restProps }
						{ ...transformProps(RadioButton, restProps) }
						checked={this.props.value}
						checkedIcon={ this.props.checkedIcon || <CheckedIconDefault /> }
						uncheckedIcon={this.props.uncheckedIcon || <UncheckedIconDefault /> }
						onClick={ this._handleClick }
						onBlur={ () => this.props.onBlur(this.props.value) }
					/>
				{ this.handleError({errorText, warnText, passText}) }
			</div>
		);
	}

};

export default CheckboxInput;
