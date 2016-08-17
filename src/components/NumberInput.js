import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';

import { transformProps } from './utils/material.js';

const validate = (input) => {
	const re = /\b\d+$/;
	const result = re.test(input);
	return result;
};

class NumberInput extends React.Component{
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

	constructor() {
		super();
		this.state = {value: ''};
	}

	componentWillReceiveProps(newProps) {
		if (newProps.value) this.setState({value: undefined});
	}

	handleOnBlur(e) {
		if (this.state.value && this.state.value !== this.props.value) {
			this.props.onChange(parseInt(this.state.value));
			this.props.onBlur(parseInt(this.state.value));
		} else {
			this.props.onBlur(this.props.value);
		}
	}

	handleOnChange(e) {
		const input = e.target.value;
		if (input.length > 0) {
			const validatedValue = validate(input);
			if (validatedValue) {
				this.setState({value: input});
			} else {
				console.error(`Wrong input: ${input}!`);
			}
		}
	}

	render() {
		return (
			<div>
				<TextField
					{ ...transformProps(TextField, this.props) }
					value={ this.state.value || this.props.value }
					onBlur={ this.handleOnBlur.bind(this) }
					onChange={ this.handleOnChange.bind(this) }
				/>
			</div>
		);
	}
};

export default NumberInput;
