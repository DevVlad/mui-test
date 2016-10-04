/* eslint-disable no-unused-vars */

import React, { PropTypes } from 'react';
import { connect } from 'react-redux';
import TestDuck from './redux/ducks/TestDuck.js';
import TextInput from './components/TextInput.js';
import DropdownInput from './components/DropdownInput.js';
import EntityInput from './components/EntityInput.js';
import TimeInput from './components/TimeInput.js';
import DateInput from './components/DateInput.js';
import ToggleInput from './components/ToggleInput.js';
import CheckboxInput from './components/CheckboxInput.js';
import NumberInput from './components/NumberInput.js';
import TextareaInput from './components/TextareaInput.js';
import { Flex, Box } from 'reflexbox';
import { keymap } from './keymap.js';
import { ShortcutManager, Shortcuts } from 'react-shortcuts';
import $ from 'jquery';

const shortcutManager = new ShortcutManager(keymap);

const DATA = [
	{ id: 0, name: 'monday' },
	{ id: 1, name: 'tuesday' },
	{ id: 2, name: 'wednesday' },
	{ id: 3, name: 'thursday' },
	{ id: 4, name: 'friday' },
	{ id: 5, name: 'saturday' },
	{ id: 6, name: 'sunday' }
];

const DATA_STRINGS = DATA.map(e => e.name);

const KONTAKT_FIELDS = 	['jmeno', 'prijmeni', 'email', 'mobil', 'tel'];

const jmenoPrijmeni = e => [e.jmeno, e.prijmeni].join(' ').trim();
const kontaktCondition = t => KONTAKT_FIELDS.map(f => ({ left: f, right: `${t}` }));
const entityName = e => e.name;
const entityId = e => e.id;

class ComponentsTest extends React.Component {
	static childContextTypes = {
		shortcuts: PropTypes.object,
		suppressEsc: PropTypes.func,
		unSuppressEsc: PropTypes.func
	};

	getChildContext() {
		return {
			suppressEsc: () => this.suppressEsc++,
			unSuppressEsc: () => this.suppressEsc--
		};
	}

	constructor() {
		super();
		this.state = { defaultEntityId: 107, stackOfOpens: 0 };
		this.suppressEsc = 0;
	}

	componentWillMount() {
		if (this.state.defaultEntityId) {
			this.props.setEntityId(107);
			this.setState({ defaultEntityId: undefined });
		}
	}

	handleProvideError = (errProvided) => {
		if (errProvided) {
			this.errorMsg = this.props.longNtfProvider ? 'This is how it should look like in case of veeeeeerrrrryyyyy long error text' : 'Short error.';
		} else {
			this.errorMsg = undefined;
		}
		this.props.setErrorProvider(errProvided);
	};

	handleProvideWarn = (warnProvided) => {
		if (warnProvided) {
			this.warningMsg = this.props.longNtfProvider ? 'This is how it should look like in case of veeeeeerrrrryyyyy long warning text' : 'Short warning.';
		} else {
			this.warningMsg = undefined;
		}
		this.props.setWarnProvider(warnProvided);
	};

	handleLongNtfProvider = (longNtfs) => {
		if (this.props.warnProvider || this.props.errorProvider) {
			window.alert(`First, you should unselect notification provider: ${this.props.errorProvider ? 'error' : 'warning'}`);
		} else {
			this.props.setLongNtfProvider(longNtfs);
		}

	};

	renderModal() {
		return (
			<div id="shortcutTestingModal" className="modal fade" role="dialog">
				<div className="modal-dialog">
					<div className="modal-content">
						<div className="modal-header">
							<button type="button" className="close" data-dismiss="modal">&times;</button>
							<h4 className="modal-title">Shortcuts testing Modal</h4>
						</div>
						<div className="modal-body">
							<DateInput
								label="Date"
								onChange={ this.props.setDate }
								value={ this.props.date }
								enableMousePicker
								locale="cs"
								errorText={ this.errorMsg }
								warnText={ this.warningMsg }
								onShow={ (bool) => {
									const res = bool ? 1 : -1;
									this.setState({
										stackOfOpens: this.state.stackOfOpens + res
									});
								}}
							/>
							<br/>
							<TextInput
								label="Text"
								value={this.props.text}
								onChange={this.props.setText}
								errorText={ this.errorMsg }
								warnText={ this.warningMsg }
							/>
						</div>
						<div className="modal-footer">
							<button type="button" className="btn btn-default" data-dismiss="modal">Close</button>
						</div>
					</div>
				</div>
			</div>
		);
	}

	handlerShortcuts(action, event) {
		switch (action) {
			case 'close':
				console.log('esc-action', this.state, event);
				if (this.state.stackOfOpens > 0) {
					event.preventDefault();
					console.log('jede dal');
				} else {
					event.stopPropagation();
					console.log('zavru modal');
				}
				break;
			default:
				break;
		}
	}

	render() {
		return (
			<Flex id="xxx">
				<Box col={4}>
					<CheckboxInput
						label="Provide error msg"
						value={ this.props.errorProvider }
						onChange={ this.handleProvideError }
					/>
					<br />
					<CheckboxInput
						label="Provide warning msg"
						value={ this.props.warnProvider }
						onChange={ this.handleProvideWarn }
					/>
					<br />
					<CheckboxInput
						label="Enable long notifications"
						value={ this.props.longNtfProvider }
						onChange={ this.handleLongNtfProvider }
					/>
				<br/>
				<Shortcuts name="app" handler={this.handlerShortcuts.bind(this)} targetNodeSelector="#xxx">
					<button type="button" className="btn btn-info btn-lg" data-toggle="modal" data-target="#shortcutTestingModal">Open DateInputModal</button>
					{this.renderModal()}
				</Shortcuts>

				</Box>
				<Box col={4}>
					<TextInput
						label="Text"
						value={ this.props.text }
						onChange={ this.props.setText }
						errorText={ this.errorMsg }
						warnText={ this.warningMsg }
					/>
					<br />
					<TextareaInput
						label="Textarea"
						value={ this.props.textarea }
						onChange={ this.props.setTextarea }
						errorText={ this.errorMsg }
						warnText={ this.warningMsg }
					/>
					<br />
					<DropdownInput
						label="Dropdown"
						value={ this.props.dropdown }
						onChange={ this.props.setDropdown }
						data={ DATA_STRINGS }
						errorText={ this.errorMsg }
						warnText={ this.warningMsg }
					/>
					<br />
					<EntityInput
						alias="a"
						label="Entity"
						entityType="kontakt"
						entityToText={jmenoPrijmeni}
						filterToCondition={kontaktCondition}
						onChange={this.props.setEntityId}
						value={this.props.entityId || this.defaultEntityId}
						errorText={ this.errorMsg }
						warnText={ this.warningMsg }
					/>
					<br />
					<TimeInput
						timeFormat={ 24 }
						label="Time"
						onChange={ this.props.setTime }
						locale="cs"
						value={ this.props.time }
						enableMousePicker
						errorText={ this.errorMsg }
						warnText={ this.warningMsg }
					/>
					<br/>
					<DateInput
						label="Date"
						onChange={ this.props.setDate }
						value={ this.props.date }
						enableMousePicker
						locale="cs"
						errorText={ this.errorMsg }
						warnText={ this.warningMsg }
						// displayFormat="YYYY/MM/DD"
					/>
					<br/>
					<CheckboxInput
						label="Checkbox"
						value={ this.props.checkbox }
						onChange={ this.props.setCheckbox }
						errorText={ this.errorMsg }
						warnText={ this.warningMsg }
					/>
					<br/>
					<ToggleInput
						label="Toggle"
						value={ this.props.toggle }
						onChange={ this.props.setToggle }
						errorText={ this.errorMsg }
						warnText={ this.warningMsg }
					/>
					<br/>
					<NumberInput
						label="Number"
						value={ this.props.number }
						onChange={ this.props.setNumber }
						errorText={ this.errorMsg }
						warnText={ this.warningMsg }
						locale="cs"
					/>
				</Box>
				<Box col={4}>
					<TextInput
						label="Text"
						value={this.props.text}
						onChange={this.props.setText}
						errorText={ this.errorMsg }
						warnText={ this.warningMsg }
					/>
					<br />
					<TextareaInput
						label="Textarea"
						value={ this.props.textarea }
						onChange={ this.props.setTextarea }
						errorText={ this.errorMsg }
						warnText={ this.warningMsg }
					/>
					<br />
					<DropdownInput
						label="Dropdown"
						value={this.props.dropdown}
						onChange={this.props.setDropdown}
						data={DATA_STRINGS}
						errorText={ this.errorMsg }
						warnText={ this.warningMsg }
					/>
					<br />
					<EntityInput
						alias="a"
						label="Entity"
						entityType="kontakt"
						entityToText={jmenoPrijmeni}
						filterToCondition={kontaktCondition}
						onChange={this.props.setEntityId}
						value={this.props.entityId || this.defaultEntityId}
						errorText={ this.errorMsg }
						warnText={ this.warningMsg }
					/>
					<br />
					<TimeInput
						timeFormat={ 24 }
						label="Time"
						onChange={ this.props.setTime }
						locale="cs"
						value={ this.props.time }
						enableMousePicker
						errorText={ this.errorMsg }
						warnText={ this.warningMsg }
					/>
					<br/>
					<DateInput
						label="Date"
						onChange={ this.props.setDate }
						value={ this.props.date }
						enableMousePicker
						locale="cs"
						errorText={ this.errorMsg }
						warnText={ this.warningMsg }
						// displayFormat="YYYY/MM/DD"
					/>
					<br/>
					<CheckboxInput
						label="Checkbox"
						value={ this.props.checkbox }
						onChange={ this.props.setCheckbox }
						errorText={ this.errorMsg }
						warnText={ this.warningMsg }
					/>
					<br/>
					<ToggleInput
						label="Toggle"
						value={ this.props.toggle }
						onChange={ this.props.setToggle }
						errorText={ this.errorMsg }
						warnText={ this.warningMsg }
					/>
					<br/>
					<NumberInput
						label="Number"
						value={ this.props.number }
						onChange={ this.props.setNumber }
						errorText={ this.errorMsg }
						warnText={ this.warningMsg }
						locale="cs"
					/>
				</Box>
			</Flex>
		);
	}
}

ComponentsTest = connect(
	...TestDuck.connect(
		'text',
		'other',
		'dropdown',
		'dropdownId',
		'entityId',
		'time',
		'date',
		'toggle',
		'checkbox',
		'errorProvider',
		'warnProvider',
		'number',
		'longNtfProvider',
		'textarea'
))(ComponentsTest);

export default class App extends React.Component {
	static childContextTypes = {
		shortcuts: PropTypes.object.isRequired
	};

	getChildContext() {
		return {
			shortcuts: shortcutManager
		};
	}

	render() {
		return (
			<ComponentsTest />
		);

	}
}
