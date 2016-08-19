import React, { PropTypes } from 'react';
import TextField from 'material-ui/TextField';
import DateIcon from 'material-ui/svg-icons/action/date-range';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import DatePickerDialog from 'material-ui/DatePicker/DatePickerDialog.js';
import moment from 'moment';

import { transformProps, colors } from './utils/material.js';
import getPluginIcons from './utils/iconPluginHandler.js';
import PureComponent from 'react-pure-render/component';

const DATE_PART = { DAY: 'D', MONTH: 'M', YEAR: 'Y' };

const knownLocales = {};

const getDateParts = (locale) => {
	let result = knownLocales[locale] || [];
	if (result.length === 0) {
		const testDate = new Date(2000, 2 - 1, 3, 12);
		const text = Intl.DateTimeFormat(locale, {
			year: 'numeric', month: 'numeric', day: 'numeric'}).format(testDate);
		const re = /.*?(\d+)(?:\D+(\d+)(?:\D+(\d+))?)?.*/;
		const match = re.exec(text);
		for (let i = 1; i < 4; i++) {
			switch (parseInt(match[i], 10)) {
				case 2000:
					result.push(DATE_PART.YEAR);
					break;
				case 2:
					result.push(DATE_PART.MONTH);
					break;
				case 3:
					result.push(DATE_PART.DAY);
					break;
				default: break;
			}
		}
		knownLocales[locale] = result;
	}
	return result;
};

const CENTURY_WINDOW = 20;

const fixCentury = (year) => {
	if (year > 100) {
		return year;
	}
	const thisYear = new Date().getFullYear();
	const edgeYear = thisYear + CENTURY_WINDOW;
	let result = Math.floor(thisYear / 100) * 100 + year;
	if (result > edgeYear) {
		result -= 100;
	}
	return result;
};

const parseDate = (parts, text) => {
	const re = /.*?(\d+)(?:\D+(\d+)(?:\D+(\d+))?)?.*/;
	const match = re.exec(text);
	const now = new Date();
	let day = now.getDate();
	let month = now.getMonth() + 1;
	let year = now.getFullYear();
	if (!match) {
		throw new Error('unparsed date ' + text);
	}
	if (!match[2]) {
		day = match[1];
	} else {
		parts.forEach((part, index) => {
			if (match[index + 1]) {
				switch (part) {
					case DATE_PART.DAY:
						day = match[index + 1];
						break;
					case DATE_PART.MONTH:
						month = match[index + 1];
						break;
					case DATE_PART.YEAR:
						year = fixCentury(parseInt(match[index + 1], 10));
						break;
					default:
						throw new Error('unknown part ' + part);
				}
			}
		});
	}
	return new Date(year, month - 1, day);
};

class DateInput extends PureComponent {
	static propTypes = {
		label: PropTypes.string,
		onChange: PropTypes.func,
		onBlur: PropTypes.func,
		disabled: PropTypes.bool,
		value: PropTypes.object,
		enableMousePicker: PropTypes.bool,
		locale: PropTypes.string,
		warnText: PropTypes.string,
		errorText: PropTypes.string,
	};

	static defaultProps = {
		onChange: () => {},
		onBlur: () => {}
	};

	constructor(props) {
		super(props);
		this.state = {
			toDisplay: '',
			typing: false,
		};
	}

	componentWillReceiveProps(newProps) {
		if (!newProps.value) {
			this.setState({
				toDisplay: '',
			});
		} else {
			const outputDate = this.formatDate(newProps.value);
			this.setState({ toDisplay: outputDate });
		}
	}

	formatDate(date) {
		let formatedDate;
		if (this.props.displayFormat) {
			formatedDate = moment.parseZone(date).format(this.props.displayFormat);
		} else {
			formatedDate = Intl.DateTimeFormat(this.props.locale).format(date);
		}
		return formatedDate;
	}

	handleOnKeyDown(e) {
		if (e.keyCode === 13) {
			const elem = e.target.value;
			const newDate = parseDate(getDateParts(this.props.locale), elem);
			if (this.formatDate(newDate) !== this.formatDate(this.props.value)) this.props.onChange(newDate);
		}

	}

	handleOnBlur(e) {
		const elem = e.target.value;
		if (elem) {
			// const newDate = parseDate(['D', 'M', 'Y'], elem);
			const newDate = parseDate(getDateParts(this.props.locale), elem);
			if (this.formatDate(newDate) !== this.formatDate(this.props.value)) this.props.onChange(newDate);
		} else {
			if (this.props.value) this.props.onChange(undefined);
		}
		if (this.state.typing) this.setState({typing: false});
	}

	handleOnChangeOfDatePicker(date) {
		this.props.onChange(date);
		if (this.state.typing) this.setState({ typing: false });
	}

	handleOnChange(e) {
		this.setState({ toDisplay: e.target.value, typing: true });
	}

	dateIconPlugin = ({style, enableMousePicker}) => {
		if (enableMousePicker) {
			return (
				<DateIcon
					key="date"
					color={ colors.disabled }
					hoverColor={ colors.info }
					style={{ ...style, width: '18px', height: '18px' }}
					onClick={ () => { this.refs.datePicker.show() } }
				/>
			);
		}
		return null;
	};

	clearIconPlugin = ({ style, value, isTyping }) => {
		if (value && !isTyping) {
			return <ClearIcon
				key="clear"
				color={ colors.disabled }
				hoverColor={ colors.normal }
				onClick={ () => this.props.onChange(null) }
				style={{ ...style, width: '18px', height: '18px' }}
			/>
		}
		return null;
	};

	render() {
		const { enableMousePicker, value, errorText, warnText, passText } = this.props;

		return (
			<div>
				<TextField
					{ ...transformProps(TextField, this.props) }
					onBlur={ this.handleOnBlur.bind(this) }
					value={ this.state.toDisplay }
					onKeyDown={ this.handleOnKeyDown.bind(this) }
					onChange={ this.handleOnChange.bind(this) }
					inputStyle={{ paddingLeft: '5px' }}
				/>
				{ getPluginIcons({
					value,
					isTyping: this.state.typing,
					enableMousePicker,
					notifications: errorText || warnText || passText},
					[ this.dateIconPlugin, this.clearIconPlugin ])
				}
				<DatePickerDialog
					ref='datePicker'
					firstDayOfWeek={ 1 }
					onAccept={ this.handleOnChangeOfDatePicker.bind(this) }
					DateTimeFormat={ global.Intl.DateTimeFormat }
					initialDate={ value || new Date() }
					locale={ this.props.locale }
				/>
			</div>
		);
	}
}

export default DateInput;
