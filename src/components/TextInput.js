import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import { transformProps } from './utils/material.js';

class TextInput extends React.Component {
	static propTypes = {
		label: PropTypes.string,
		value: PropTypes.string,
		disabled: PropTypes.bool,
		errorText: PropTypes.string,
		onChange: PropTypes.func,
		onBlur: PropTypes.func
	};

	constructor() {
		super();
		this.handleChange = this.handleChange.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
	}

	handleChange(e) {
		if (this.props.onChange) this.props.onChange(e.target.value);
	}

	handleBlur(e) {
		if (this.props.onBlur) this.props.onBlur(e.target.value);
	}

	render() {
		return (
			<TextField
				{ ...transformProps(TextField, this.props) }
				onChange={this.handleChange}
				onBlur={this.handleBlur}
			/>
		);
	}
}

export default TextInput;