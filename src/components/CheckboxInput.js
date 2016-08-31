import React, { PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';
import UncheckedIconDefault from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import CheckedIconDefault from 'material-ui/svg-icons/toggle/check-box';
import PureComponent from 'react-pure-render/component';
import stylePropType from 'react-style-proptype';
import { transformProps } from './utils/material.js';
import ErrorLabel from './ErrorLabel.js';

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
		style: stylePropType
	};

	static defaultProps = {
		onChange: () => {},
		onBlur: () => {},
		value: false,
		labelPosition: "right",
		style: { width: '256px' }
	};

	_handleClick = () => {
		this.props.onChange(!this.props.value);
	};

	render() {
		const { value, label } = this.props;
		return (
			<div style={{...this.props.style}}>
				<Checkbox
					{ ...transformProps(Checkbox, this.props) }
					checked={value}
					label={label}
					checkedIcon={ this.props.checkedIcon || <CheckedIconDefault /> }
					uncheckedIcon={this.props.uncheckedIcon || <UncheckedIconDefault /> }
					onClick={ this._handleClick }
					onBlur={ () => this.props.onBlur(this.props.value) }
				/>
				<ErrorLabel
					{...transformProps(ErrorLabel, this.props)}
				/>
			</div>
		);
	}

};

export default CheckboxInput;
