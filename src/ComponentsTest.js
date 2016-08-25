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
import NumberInput from './components/NumberInput.js';
import TextareaInput from './components/TextareaInput.js';
// import AutoComplete from 'material-ui/AutoComplete';

import { Grid, Row, Col } from 'react-flexbox-grid';
import { wrap } from './wrap.js';

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

import Immutable from 'immutable';

const dictionary = Immutable.fromJS({
	nazev: 'name',
	castka: 'amount',
	manzelky: 'wives',
	prijmeni: 'surname',
	prvni: 'first',
	druha: 'second',
	deti: 'children',
	osoba: 'person'
});

class ComponentsTest extends React.Component {

	constructor() {
		super();
		this.state = { defaultEntityId: 107 };
	}

	componentWillMount() {
		if (this.state.defaultEntityId) {
			this.props.setEntityId(107);
			this.setState({ defaultEntityId: undefined });
		}
		const x = wrap({
			id: 123,
			nazev: 'aaa',
			castka: 100.00,
			manzelky: {
				prvni: {
					deti: ['Pavel', 'Petr'],
					osoba: 'Karolina'
				},
				druha: {
					deti: ['alena', 'lojzik'],
					osoba: 'Jana'
				},
			},
			prijmeni: 'Nevim'
		}, dictionary);
		console.log(x);
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

	render() {
		return (
			<Grid>
				<Row between="xs">
					<Col xs={3} md={3}>
						<CheckboxInput
							label="Provide error msg"
							value={ this.props.errorProvider }
							onChange={ this.handleProvideError }
						/>
						<CheckboxInput
							label="Provide warning msg"
							value={ this.props.warnProvider }
							onChange={ this.handleProvideWarn }
						/>
						<CheckboxInput
							label="Enable long notifications"
							value={ this.props.longNtfProvider }
							onChange={ this.handleLongNtfProvider }
						/>
					</Col>
					<Col xs={3} md={3}>
						<TextInput
							label="TextInput - 2. row"
							value={ this.props.text }
							onChange={ this.props.setText }
							errorText={ this.errorMsg }
							warnText={ this.warningMsg }
						/>
						<br />
						<TextareaInput
							label="Textarea - 2. row"
							value={ this.props.textarea }
							onChange={ this.props.setTextarea }
							errorText={ this.errorMsg }
							warnText={ this.warningMsg }
						/>
						<br />
						<DropdownInput
							label="Dropdown strings - 2.row"
							value={ this.props.dropdown }
							onChange={ this.props.setDropdown }
							data={ DATA_STRINGS }
							errorText={ this.errorMsg }
							warnText={ this.warningMsg }
						/>
						<br />
						<EntityInput
							alias="a"
							label="EntityInput - 2. row"
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
							label="Time - 2. row"
							onChange={ this.props.setTime }
							locale="cs"
							value={ this.props.time }
							enableMousePicker
							errorText={ this.errorMsg }
							warnText={ this.warningMsg }
						/>
						<br/>
						<DateInput
							label="Date - 2. row"
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
							label="Checkbox for some fancy things - 2. row"
							value={ this.props.checkbox }
							onChange={ this.props.setCheckbox }
							errorText={ this.errorMsg }
							warnText={ this.warningMsg }
						/>
						<br/>
						<ToggleInput
							label="Toggle - 2. row"
							value={ this.props.toggle }
							onChange={ this.props.setToggle }
							errorText={ this.errorMsg }
							warnText={ this.warningMsg }
						/>
						<br/>
						<NumberInput
							label="Number - 2. row"
							value={ this.props.number }
							onChange={ this.props.setNumber }
							errorText={ this.errorMsg }
							warnText={ this.warningMsg }
							locale="cs"
						/>
					</Col>
					<Col xs={3} md={3}>
						<TextInput
							label="TextInput - 3. row"
							value={this.props.text}
							onChange={this.props.setText}
							errorText={ this.errorMsg }
							warnText={ this.warningMsg }
						/>
						<br />
						<TextareaInput
							label="Textarea - 3. row"
							value={ this.props.textarea }
							onChange={ this.props.setTextarea }
							errorText={ this.errorMsg }
							warnText={ this.warningMsg }
						/>
						<DropdownInput
							label="Dropdown strings - 3.row"
							value={this.props.dropdown}
							onChange={this.props.setDropdown}
							data={DATA_STRINGS}
							errorText={ this.errorMsg }
							warnText={ this.warningMsg }
						/>
						<EntityInput
							alias="a"
							label="EntityInput - 3. row"
							entityType="kontakt"
							entityToText={jmenoPrijmeni}
							filterToCondition={kontaktCondition}
							onChange={this.props.setEntityId}
							value={this.props.entityId || this.defaultEntityId}
							errorText={ this.errorMsg }
							warnText={ this.warningMsg }
						/>
						<TimeInput
							timeFormat={ 24 }
							label="Time - 3. row"
							onChange={ this.props.setTime }
							locale="cs"
							value={ this.props.time }
							enableMousePicker
							errorText={ this.errorMsg }
							warnText={ this.warningMsg }
						/>
						<br/>
						<DateInput
							label="Date - 3. row"
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
							label="Checkbox for some fancy things - 3. row"
							value={ this.props.checkbox }
							onChange={ this.props.setCheckbox }
							errorText={ this.errorMsg }
							warnText={ this.warningMsg }
						/>
						<br/>
						<ToggleInput
							label="Toggle - 3. row"
							value={ this.props.toggle }
							onChange={ this.props.setToggle }
							errorText={ this.errorMsg }
							warnText={ this.warningMsg }
						/>
						<br/>
						<NumberInput
							label="Number - 3. row"
							value={ this.props.number }
							onChange={ this.props.setNumber }
							errorText={ this.errorMsg }
							warnText={ this.warningMsg }
							locale="cs"
						/>
					</Col>
				</Row>
			</Grid>

		);
	}
}

export default connect(
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

{/*}<div>
	<CheckboxInput
		label="Provide error msg"
		value={ this.props.errorProvider }
		onChange={ this.handleProvideError }
	/>
	<CheckboxInput
		label="Provide warning msg"
		value={ this.props.warnProvider }
		onChange={ this.handleProvideWarn }
	/>
	<CheckboxInput
		label="Enable long notifications"
		value={ this.props.longNtfProvider }
		onChange={ this.handleLongNtfProvider }
	/>
	<TextInput
		label="TextInput1"
		value={this.props.text}
		onChange={this.props.setText}
		errorText={ this.errorMsg }
		warnText={ this.warningMsg }
	/>
	<br/>
	<TextInput
		label="TextInput2"
		value={this.props.text}
		onChange={this.props.setText}
		errorText={ this.errorMsg }
		warnText={ this.warningMsg }
	/>
	<br/>
	<TextInput
		label="Other"
		value={this.props.other}
		onChange={this.props.setOther}
		errorText={ this.errorMsg }
		warnText={ this.warningMsg }
	/>
	<br/>
	<EntityInput
		alias="a"
		label="EntityInput"
		entityType="kontakt"
		entityToText={jmenoPrijmeni}
		filterToCondition={kontaktCondition}
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
		entityToText={jmenoPrijmeni}
		filterToCondition={kontaktCondition}
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
		entityToText={entityName}
		entityToValue={entityId}
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
		label="Checkbox for some fancy things"
		value={ this.props.checkbox }
		onChange={ this.props.setCheckbox }
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
</div>*/}
