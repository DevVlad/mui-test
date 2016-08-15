/* eslint-disable no-unused-vars */

import React from 'react';
import { connect } from 'react-redux';
import TestDuck from './redux/ducks/TestDuck.js';
import TextInput from './components/TextInput.js';
import DropdownInput from './components/DropdownInput.js';
import EntityInput from './components/EntityInput.js';
import AutoComplete from './components/material-ui/AutoComplete.js';
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

	render() {
		if (this.state.defaultEntityId) {
			this.props.setEntityId(107);
			this.setState({ defaultEntityId: undefined});
		}
		return (
			<div>
				<TextInput
					label="TextInput"
					value={this.props.text}
					onChange={this.props.setText}
				/>
				<br/>
				<TextInput
					label="TextInput"
					value={this.props.text}
					onChange={this.props.setText}
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
				/>
				<br/>
				<DropdownInput
					label="Dropdown strings"
					value={this.props.dropdown}
					onChange={this.props.setDropdown}
					data={DATA_STRINGS}
				/>
				<br/>
				<DropdownInput
					label="Dropdown objects"
					value={this.props.dropdownId}
					onChange={this.props.setDropdownId}
					data={DATA}
					entityToText={e => e.name}
					entityToValue={e => e.id}
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
	...TestDuck.connect('text', 'dropdown', 'dropdownId', 'entityId')
)(ComponentsTest);