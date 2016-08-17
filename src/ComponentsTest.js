/* eslint-disable no-unused-vars */

import React from 'react';
import { connect } from 'react-redux';
import TestDuck from './redux/ducks/TestDuck.js';
import TextInput from './components/TextInput.js';
import DropdownInput from './components/DropdownInput.js';
import EntityInput from './components/EntityInput.js';
import AutoComplete from './components/material-ui/AutoComplete.js';
import TimeInput from './components/TimeInput.js';
import DateInput from './components/DateInput.js';
import ToggleInput from './components/ToggleInput.js';
import CheckboxInput from './components/CheckboxInput.js';
// import AutoComplete from 'material-ui/AutoComplete';

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

class ComponentsTest extends React.Component {

	constructor() {
		super();
		this.state = { defaultEntityId: 107 };
	}

	componentWillMount() {
		if (this.state.defaultEntityId) {
			this.props.setEntityId(107);
			this.setState({ defaultEntityId: undefined});
		}
	}

	handleProvideErr = (errProvided) => {
		if (errProvided) {
			this.errorMsg = 'Error showroom.'
		} else {
			this.errorMsg = undefined;
		}
		this.props.setErrorProvider(errProvided);
	};

	handleProvideWarn = (warnProvided) => {
		if (warnProvided) {
			this.warningMsg = 'Warning showroom.'
		} else {
			this.warningMsg = undefined;
		}
		this.props.setWarnProvider(warnProvided);
	};

	render() {
		return (
			<div>
				<CheckboxInput
					label="Provide error msg"
					value={ this.props.errorProvider }
					onChange={ this.handleProvideErr.bind(this) }
				/>
				<CheckboxInput
					label="Provide warning msg"
					value={ this.props.warnProvider }
					onChange={ this.handleProvideWarn.bind(this) }
				/>
				<TextInput
					label="TextInput"
					value={this.props.text}
					onChange={this.props.setText}
					errorText={ this.errorMsg }
					warnText={ this.warningMsg }
				/>
				<br/>
				<TextInput
					label="TextInput"
					value={this.props.text}
					onChange={this.props.setText}
					errorText={ this.errorMsg }
					warnText={ this.warningMsg }
				/>
				<br/>
				<EntityInput
					alias="a"
					label="EntityInput"
					entityType="kontakt"
					entityToText={e => [e.jmeno, e.prijmeni].join(' ').trim()}
					filterToCondition={t => KONTAKT_FIELDS.map(f => ({ left: f, right: `${t}` }))}
					onChange={this.props.setEntityId}
					value={this.props.entityId || this.defaultEntityId}
					errorText={ this.errorMsg }
					warnText={ this.warningMsg }
				/>
				<br/>
				<EntityInput
					alias="a"
					label="EntityInput"
					entityType="kontakt"
					entityToText={e => [e.jmeno, e.prijmeni].join(' ').trim()}
					filterToCondition={t => KONTAKT_FIELDS.map(f => ({ left: f, right: `${t}` }))}
					onChange={this.props.setEntityId}
					value={this.props.entityId || this.defaultEntityId}
					errorText={ this.errorMsg }
					warnText={ this.warningMsg }
				/>
				<br/>
				<DropdownInput
					label="Dropdown strings"
					value={this.props.dropdown}
					onChange={this.props.setDropdown}
					data={DATA_STRINGS}
					errorText={ this.errorMsg }
					warnText={ this.warningMsg }
				/>
				<br/>
				<DropdownInput
					label="Dropdown objects"
					value={this.props.dropdownId}
					onChange={this.props.setDropdownId}
					data={DATA}
					entityToText={e => e.name}
					entityToValue={e => e.id}
					errorText={ this.errorMsg }
					warnText={ this.warningMsg }
				/>
				<br/>
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
				<br />
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
				<ToggleInput
					label="Toggle"
					value={ this.props.toggle }
					onChange={ this.props.setToggle }
					errorText={ this.errorMsg }
					warnText={ this.warningMsg }
				/>
				<br/>
				<CheckboxInput
					label="Checkbox"
					value={ this.props.checkbox }
					onChange={ this.props.setCheckbox }
					errorText={ this.errorMsg }
					warnText={ this.warningMsg }
				/>
				{/*
				<br/>
				<DropdownInput
					label="Dropdown objects 2"
					value={this.props.dropdownId}
					onChange={this.props.setDropdownId}
					data={DATA}
					entityToText={e => e.name}
					entityToValue={e => e.id}
				/>
				<br/>
				<AutoComplete
					dataSource={DATA_STRINGS}
					label="AutoComplete"
					filter={() => true}
				/>
				<br/>
				*/}
			</div>
		);
	}
}

export default connect(
	...TestDuck.connect(
		'text',
		'dropdown',
		'dropdownId',
		'entityId',
		'time',
		'date',
		'toggle',
		'checkbox',
		'errorProvider',
		'warnProvider'
))(ComponentsTest);
