import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import { transformProps } from './utils/material.js';
import PureComponent from 'react-pure-render/component';
import stylePropType from 'react-style-proptype';

class TextareaInput extends PureComponent {
	static propTypes = {
		label: PropTypes.string,
		errorText: PropTypes.string,
		warnText: PropTypes.string,
		onBlur: PropTypes.func,
		onChange: PropTypes.func,
		value: PropTypes.string,
		textareaStyle: stylePropType,
		rowsMax: PropTypes.number
	};

	static defaultProps = {
		onChange: () => {},
		onBlur: () => {},
		rowsMax: 5,
		multiLine: true
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
		const { label, errorText, warnText, passText, ...restProps } = this.props;
		return (
			<div>
					<TextField
						{ ...restProps }
						{ ...transformProps(TextField, this.props) }
						onBlur={ this.handleBlur }
						onChange={ this.handleChange }
					/>
			</div>
		);
	}

};

export default TextareaInput;
