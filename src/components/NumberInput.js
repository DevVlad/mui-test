import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';

import { transformProps } from './utils/material.js';
import PureComponent from 'react-pure-render/component';

class NumberInput extends PureComponent {
	static propTypes = {
		label: PropTypes.string,
		errorText: PropTypes.string,
		warnText: PropTypes.string,
		disabled: PropTypes.bool,
		onBlur: PropTypes.func,
		onChange: PropTypes.func,
		value: PropTypes.number
	};

	static defaultProps = {
		onChange: () => {},
		onBlur: () => {}
	};

	static _validateNumber = (input) => {
		const re = /\b\d+$/;
		return re.test(input);
	};

	constructor() {
		super();
		this.state = {value: ''};
	}

	componentWillReceiveProps(newProps) {
		this.setState({value: newProps.value || '', isTyping: undefined});
	}

	handleOnBlur() {
		if (this.state.value && this.state.value !== this.props.value) {
			this.props.onChange(parseInt(this.state.value, 10));
		} else {
			if (this.props.value && !this.state.isTyping) {
				this.props.onBlur(this.props.value);
			} else {
				this.props.onChange(undefined);
			}

		}
	}

	handleOnChange(e) {
		const input = e.target.value;
		const validatedValue = NumberInput._validateNumber(input);
		if (validatedValue || !input) {
			this.setState({value: input, isTyping: true});
		} else {
			console.error(`Wrong input: ${input}!`);
		}
	}

	render() {
		console.log('>>> NumberInput', this.props.label);

		return (
			<div>
				<TextField
					{ ...transformProps(TextField, this.props) }
					value={ this.state.value }
					onBlur={ this.handleOnBlur.bind(this) }
					onChange={ this.handleOnChange.bind(this) }
				/>
			</div>
		);
	}
};

export default NumberInput;
