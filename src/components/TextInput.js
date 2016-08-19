import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import { transformProps } from './utils/material.js';
import PureComponent from 'react-pure-render/component';

class TextInput extends PureComponent {
	static propTypes = {
		label: PropTypes.string,
		value: PropTypes.string,
		disabled: PropTypes.bool,
		errorText: PropTypes.string,
		onChange: PropTypes.func,
		onBlur: PropTypes.func
	};

	static defaultProps = {
		onChange: () => {},
		onBlur: () => {},
	};

	constructor() {
		super();
		this.handleChange = this.handleChange.bind(this);
		this.handleBlur = this.handleBlur.bind(this);
	}

	handleChange(e) {
		this.props.onChange(e.target.value);
	}

	handleBlur(e) {
		this.props.onBlur(e.target.value);
	}

	render() {
		return (
			<TextField
			// <input type="text"
				{ ...transformProps(TextField, this.props) }
				value={this.props.value}
				onChange={this.handleChange}
				onBlur={this.handleBlur}
				inputStyle={{ paddingLeft: '5px' }}
			/>
		);
	}
}

export default TextInput;
