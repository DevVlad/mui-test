import React, { PropTypes } from 'react';
import Checkbox from 'material-ui/Checkbox';
import UncheckedIconDefault from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import CheckedIconDefault from 'material-ui/svg-icons/toggle/check-box';
import PureComponent from 'react-pure-render/component';

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
	};

	static defaultProps = {
		onChange: () => {},
		onBlur: () => {},
		value: false,
		labelPosition: "right"
	};

	_handleClick = () => {
		this.props.onChange(!this.props.value);
	};

	render() {
		const { value, label } = this.props;
		return (
			<div>
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
