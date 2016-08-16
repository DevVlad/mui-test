import React, { PropTypes } from 'react';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog.js';
import TextField from 'material-ui/TextField';
import moment from 'moment';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import AlarmIcon from 'material-ui/svg-icons/action/alarm';

import { transformProps, colors } from './utils/material.js';
import getPluginIcons from './utils/iconPluginHandler.js';

class TimeInput extends React.Component{
	static propTypes = {
		timeFormat: PropTypes.number,
		label: PropTypes.string,
		onBlur: PropTypes.func,
		disabled: PropTypes.bool,
		locale: PropTypes.string,
		value: PropTypes.object,
		enableMousePicker: PropTypes.bool,
		errorText: PropTypes.string,
		warnText: PropTypes.string,
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
			const momentTime = this.getFormatedTime(newProps.value);
			this.setState({toDisplay: momentTime});
		}
	}

	makeADate(elem) {
		let newDate = new Date();
		const day = newDate.getDate();
		const year = newDate.getFullYear();
		const month = newDate.getMonth();
		const re = /\b(\d{1,2})(?:\D{0,}?(\d{1,2}))?(?:\D{0,}?([a-z]+))?/i;
		const result = re.exec(elem);
		let hours = parseInt(result[1], 10);
		let minutes = 0;
		let suffix;
		if (result[2]) minutes = parseInt(result[2], 10);
		if (result[3]) suffix = result[3];
		if (suffix === 'pm') hours += 12;
		const subDate = new Date(year, month, day, hours, minutes)
		newDate = subDate;
		return newDate;
	}

	getFormatedTime(date) {
		let formatForMoment;
		if (this.props.timeFormat === 12) {
			formatForMoment = 'h:mm a';
		} else {
			formatForMoment = 'HH:mm';
		}
		return moment.parseZone(date).format(formatForMoment);
	}

	handleOnBlur(e) {
		const elem = e.target.value;
		if (elem) {
			const outputDate = this.makeADate(elem);
			this.props.onChange(outputDate);
		} else {
			this.props.onChange(undefined);
		}
		if (this.state.typing) this.setState({typing: false});
	}

	handleTyping(e) {
		this.setState({toDisplay: e.target.value, typing: true});
	}

	handleOnChangeOfTimePicker(e) {
		this.props.onChange(e);
		if (this.state.typing) this.setState({ typing: false });
	}

	handleOnKeyDown(e) {
		if (e.keyCode === 13) {
			const outputDate = this.makeADate(e.target.value);
			this.props.onChange(outputDate);
		}
	}

	timeIconPlugin = ({style, enableMousePicker}) => {
		if (enableMousePicker) {
			return (
				<AlarmIcon
					key='alarm'
					color={ colors.disabled }
					hoverColor={ colors.info }
					style={{ ...style, width: '18px', height: '18px' }}
					onClick={ () => { this.refs.timePicker.show() } }
				/>
			);
		}
		return null;
	};

	clearIconPlugin = ({style, value, isTyping}) => {
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
		const { errorText, warnText, enableMousePicker, value } = this.props;

		return (
			<div id={ `timeinput` }>
				<TextField
						{ ...transformProps(TextField, this.props) }
						underlineFocusStyle={ {color: colors.info} }
						onBlur={ this.handleOnBlur.bind(this) }
						onChange={ this.handleTyping.bind(this) }
						value={ this.state.toDisplay }
						onKeyDown={this.handleOnKeyDown.bind(this)}
						errorText={ errorText || warnText }
						errorStyle={ {color: errorText ? colors.error : colors.warning} }
				/>
			{ getPluginIcons({value, isTyping: this.state.typing, enableMousePicker}, [ this.timeIconPlugin, this.clearIconPlugin ]) }
				<TimePickerDialog
					ref="timePicker"
					format={ this.props.timeFormat === 'ampm' ? 'ampm' : '24hr' }
					onAccept={ this.handleOnChangeOfTimePicker.bind(this) }
					initialTime={ this.props.value || new Date() }
				/>
			</div>
		);
	}
}

export default TimeInput;
