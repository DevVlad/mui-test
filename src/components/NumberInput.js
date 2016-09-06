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
	string.split('').forEach(char => {
		if (/\D/.test(char)) parsers.push(char);
	});
	return parsers;
};

const transformToNumber = (string, decimalParser) => {
	let output = string.trim();
	let usedParsersInStrings = getParsersFromString(output);
	// only one parser in string
	if (usedParsersInStrings.length === 1) {
		const parser = usedParsersInStrings[0];
		output = string.replace(parser, parser == decimalParser || ',' || '.' ? '.' : '');
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
			localOutput = localOutput.replace(uniqueParserFromUsed, '.');
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
	}

	componentWillMount() {
		this.setState({
			decimalParser: /55(\D)/.exec(new Intl.NumberFormat(this.props.locale).format(55.66))[1]
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

	parseStr = (str, operators) => {
		const opReg = new RegExp('[^\\' + operators.join('\\') + ']+|[\\' + operators.join('\\') + ']', 'g');
		return str.match(opReg).map( s => {
			if (operators.indexOf(s) >= 0) {
				return s;
			} else {
				return transformToNumber(s, this.state.decimalParser);
			}
		}).join('');
	};

	handleOnBlur() {
		const { value, decimalParser, isTyping } = this.state;

		if (!/[a-z]+/i.test(value)) {
			if (value !== 0) {
				const calculated = this.tryCalculateString(value, getParsersFromString(value));
				if (calculated && isTyping) {
					if (calculated !== this.props.value) {
						this.props.onChange(calculated);
					} else {
						this.setState({
							value: new Intl.NumberFormat(this.props.locale).format(this.props.value),
							typing: undefined
						});
					}
				} else if (isTyping) {
					const transNumb = transformToNumber(value, decimalParser);
					this.props.onChange(transNumb)
				}
			}
		} else {
			if (this.props.value) {
				this.props.onChange(undefined)
			} else {
				this.setState({
					value: '',
					typing: undefined
				});
			};
		}
	}

	handleOnChange(e) {
		this.setState({
			value: e.target.value,
			isTyping: true
		});
	}


	tryCalculateString = (string, usedParsersInStrings) => {
		const mathOp = ['/', '*', '-', '+'];
		try {
			return eval(this.parseStr(string.trim(), mathOp));
		} catch (e) {
			console.error(e);
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

export const _private = {
	transformToNumber,
	getParsersFromString,
	getUniqueElemFromArray
};

export default NumberInput;
