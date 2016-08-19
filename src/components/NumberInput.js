import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';

import { transformProps } from './utils/material.js';
import PureComponent from 'react-pure-render/component';

//searching for original parser in string - if non return undefined
const exploreParsers = (arrayOfParsers) => {
	let oneAndOnlyOriginalParser = undefined;
	arrayOfParsers.forEach( parser => {
		const poppedParser = arrayOfParsers.pop(parser);
		let validateUniquity = [];
		for (let i = 0; i < arrayOfParsers.length; i++) {
			if (arrayOfParsers[i] !== poppedParser) validateUniquity.push(true);
		};
		if (validateUniquity.length === arrayOfParsers.length) oneAndOnlyOriginalParser = poppedParser;
	});
	return oneAndOnlyOriginalParser;
};

const transformToNumber = (string, decimalParser) => {
	let usedParsersInStrings = [];
	string.split('').forEach(subString => {
		if (/(\D)/.test(subString)) usedParsersInStrings.push(subString);
	});
	let output = undefined;
	// only one parser in string
	if (usedParsersInStrings.length === 1) {
		const parser = usedParsersInStrings[0];
		if (parser !== decimalParser) {
			output = string.split(parser).join((parser === '.' || parser === ',') ? '.' : '');
		} else output = string.split(parser).join('.');
	} else if (usedParsersInStrings.length > 1) {
		// more than 1 parser in string
		let localOutput = string;
		let decimalParserFound = false;
		const originalParserFound = exploreParsers(usedParsersInStrings);
		usedParsersInStrings.forEach( (parser, index) => {
			if (parser !== decimalParser && parser !== originalParserFound) {
				//case: parser is ignored, because is not original in string, or is not decimalParser
				localOutput = localOutput.split(parser).join('');
			} else localOutput = localOutput.split(parser).join('.');
		});
		//case: no decimalParser found in string, but one original parser found
		if (!decimalParserFound && originalParserFound) {
			localOutput = localOutput.split(originalParserFound).join('.');
		}
		output = localOutput;
	}
	return parseFloat(output);
};

class NumberInput extends PureComponent {
	static propTypes = {
		label: PropTypes.string,
		errorText: PropTypes.string,
		warnText: PropTypes.string,
		disabled: PropTypes.bool,
		onBlur: PropTypes.func,
		onChange: PropTypes.func,
		value: PropTypes.number,
		locale: PropTypes.string
	};

	static defaultProps = {
		onChange: () => {},
		onBlur: () => {}
	};

	constructor() {
		super();
		this.state = {value: ''};
	}

	componentWillMount() {
		const localeExample = new Intl.NumberFormat(this.props.locale).format(55.66);
		const reDecimal = /\b(?:\d*?(\D+))+/;
		this.setState({
			decimalParser: reDecimal.exec(localeExample)[1]
		});
	}

	componentWillReceiveProps(newProps) {
		if (newProps.value !== this.props.value) {
			this.setState({
				value: new Intl.NumberFormat(newProps.locale || this.props.locale).format(newProps.value),
				isTyping: undefined
			});
		}
	}

	handleOnBlur() {
		const validatedOutput = transformToNumber(this.state.value, this.state.decimalParser);
		this.props.onChange(validatedOutput);
	}

	handleOnChange(e) {
		this.setState({
			value: e.target.value,
			isTyping: true
		});
	}

	render() {
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
