import React, { PropTypes } from 'react';
import TimePickerDialog from 'material-ui/TimePicker/TimePickerDialog.js';
import TextField from 'material-ui/TextField';
import moment from 'moment';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import AlarmIcon from 'material-ui/svg-icons/action/alarm';

import { colors } from './utils/material.js';

class TimeField extends React.Component{
	static propTypes = {
		alias: PropTypes.string,
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
		onChange: () => {}
	};

	constructor(props) {
		super(props);
		this.state = {
			toDisplay: '',
			typing: false,
		};
	}

	giveMeTime(elem) {
		let newDate = new Date();
		const day = newDate.getDate();
		const year = newDate.getFullYear();
		const month = newDate.getMonth();
		const re = /\b(\d{1,2})(?:\D{0,}?(\d{1,2}))?(?:\D{0,}?([a-z]+))?/i;
		const result = re.exec(elem);
		let hours = parseInt(result[1]);
		let minutes = 0;
		let suffix;
		if (result[2]) minutes = parseInt(result[2]);
		if (result[3]) suffix = result[3];
		if (suffix && suffix === 'pm') hours = hours + 12;
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

	handleOnBlur(e) {
		const elem = e.target.value;
		if (elem) {
			const outputDate = this.giveMeTime(elem);
			this.props.onChange(outputDate);
		} else {
			this.setState({typing: false});
		}

	}

	handleOnClick() {
		this.refs.timePicker.show();
	}

	handleOnChange(e) {
		this.setState({toDisplay: e.target.value, typing: true});
	}

	handleOnChangeOfTimePicker(e) {
		this.props.onChange(e);
		this.setState({
			typing: !this.state.typing,
		});
	}

	handleOnKeyDown(e) {
		if (e.keyCode === 13) {
			const outputDate = this.giveMeTime(e.target.value);
			this.props.onChange(outputDate);
		}
	}

	timeIconPlugin = ({style, enableMousePicker}) => {
		if (enableMousePicker) {
			return (
				<div key={ `enabledMousePicker` }>
					<AlarmIcon
						color={ colors.disabled }
						hoverColor={ colors.info }
						style={{ ...style, width: '18px', height: '18px' }}
						onClick={ this.handleOnClick.bind(this) }
					/>
					<TimePickerDialog
							ref="timePicker"
							format={ this.props.timeFormat === 'ampm' ? 'ampm' : '24hr' }
							onAccept={ this.handleOnChangeOfTimePicker.bind(this) }
							initialTime={ this.props.value || new Date() }
					/>
				</div>
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

	_getPluginIcons = (variables) => {
		const plugins = [ this.timeIconPlugin, this.clearIconPlugin ];
		let icons = [];
		let index = 0;
		plugins.forEach(plugin => {
			const pluginIcon = plugin({
				...variables,
				style: { transform: `translate(${-20 * index + 236}px, ${-35 / (index + 1)}px)` }}
			);
			if (pluginIcon) {
				icons.push(pluginIcon);
				index++;
			}
		});
		return icons;
	};


	render() {
		const { errorText, warnText, enableMousePicker, disabled, floatingLabelText, value } = this.props;
		const isTyping = this.state.typing;

		return (
			<div id={ `timefield` }>
				<TextField
						disabled={ disabled }
						floatingLabelText={ floatingLabelText }
						errorStyle={ {color: colors.error} }
						underlineFocusStyle={ {color: colors.info} }
						onBlur={ this.handleOnBlur.bind(this) }
						onChange={ this.handleOnChange.bind(this) }
						value={ this.state.toDisplay }
						onKeyDown={this.handleOnKeyDown.bind(this)}
						errorText={ errorText || warnText }
						errorStyle={ {color: errorText ? colors.error : colors.warning} }
				/>
			{ this._getPluginIcons({value, isTyping, enableMousePicker}) }
			</div>
		);
	}

};

export default TimeField;
