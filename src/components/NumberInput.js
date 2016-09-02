import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import { transformProps } from './utils/material.js';
import PureComponent from 'react-pure-render/component';

//searching for original parser in string - if non return undefined
const getUniqueElemFromArray = (array) => {
	let oneAndOnlyOriginalParser = undefined;
	array.forEach( parser => {
		const poppedParser = array.pop(parser);
		let validateUniquity = [];
		array.forEach( p => {
			if (p !== poppedParser) validateUniquity.push(true);
		});
		if (validateUniquity.length === array.length) oneAndOnlyOriginalParser = poppedParser;
	});
	return oneAndOnlyOriginalParser;
};

const getParsersFromString = (string) => {
	let parsers = [];
	string.split('').forEach(subString => {
		if (/(\D)/.test(subString)) parsers.push(subString);
	});
	return parsers;
};

const transformToNumber = (string, decimalParser) => {
	let usedParsersInStrings = getParsersFromString(string);
	// try to calculate string if it is possible
	let output = string;
	// only one parser in string
	if (usedParsersInStrings.length === 1) {
		const parser = usedParsersInStrings[0];
		if (parser !== decimalParser) {
			output = string.split(parser).join((parser === '.' || parser === ',') ? '.' : '');
		} else {
			output = string.split(parser).join('.');
		}
	} else if (usedParsersInStrings.length > 1) {
		// more than 1 parser in string
		let localOutput = string;
		let decimalParserFound = false;
		const uniqueParserFromUsed = getUniqueElemFromArray(usedParsersInStrings);
		usedParsersInStrings.forEach( (parser, index) => {
			if (parser !== decimalParser && parser !== uniqueParserFromUsed) {
				//case: parser is ignored, because is not original in string, or is not decimalParser
				localOutput = localOutput.split(parser).join('');
			} else localOutput = localOutput.split(parser).join('.');
		});
		//case: no decimalParser found in string, but one original parser found
		if (!decimalParserFound && uniqueParserFromUsed) {
			localOutput = localOutput.split(uniqueParserFromUsed).join('.');
		}
		output = localOutput;
	}
	return parseFloat(output) || undefined;
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
		this.calcString = [];
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
				value: isNaN(newProps.value) ? '' : new Intl.NumberFormat(newProps.locale || this.props.locale).format(newProps.value),
				isTyping: undefined
			});
		}
	}

	handleOnBlur() {
		const { value, decimalParser, isTyping } = this.state;
				const validInput = !/[a-z]+/.test(value);

				if (validInput) {
					if (value !== 0) {
					const calculated = this.tryCalculateString(value, getParsersFromString(value));
					console.log(value, calculated);
					if (calculated && isTyping) {
						this.props.onChange(calculated);
					} else if (isTyping) {
						const transNumb = transformToNumber(value, decimalParser);
						this.props.onChange(transNumb)
					}
				}
				} else {
						this.props.value ? this.props.onChange(undefined) : this.setState({
							value: '',
							typing: undefined
						});
				}
	}

	handleOnChange(e) {
		this.setState({
			value: e.target.value,
			isTyping: true
		});
	}

	tryCalculateString = (string, usedParsersInStrings) => {
		try {
			return eval(string);
		} catch (e) {
			return undefined;
		}
	}

	render() {
		return (
			<div>
				<TextField
					{ ...transformProps(TextField, this.props) }
					value={ this.state.value }
					onBlur={ this.handleOnBlur.bind(this) }
					onChange={ this.handleOnChange.bind(this) }
					inputStyle={{ paddingLeft: '5px' }}
				/>
			</div>
		);
	}
};

export default NumberInput;
