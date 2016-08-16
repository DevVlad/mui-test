import React, { PropTypes } from 'react';
import DropdownInput from './DropdownInput.js';
import { EntityDuck } from '../redux/ducks/EntityDuck.js';
import { connect } from 'react-redux';
import AutoComplete from './material-ui/AutoComplete.js';
import lodash from 'lodash';
import { toJS } from './utils/immutable.js';
import { colors } from './utils/material.js';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import AddCircleIcon from 'material-ui/svg-icons/content/add-circle'
// import ArrowDropDownIcon from 'material-ui/svg-icons/navigation/arrow-drop-down';

class EntityInput extends React.Component {

	static propTypes = {
		...DropdownInput.propTypes,
		filterToCondition: PropTypes.func
	};

	static defaultProps = {
		filterToCondition: () => []
	};

	_loadList(condition) {
		this.props.dispatch(EntityDuck.listByCondition(this.props.entityType, condition, this.props.alias));
	}

	_handleFilterChange = lodash.debounce((filter) => {
		if (filter) {
			this._loadList(this.props.filterToCondition(filter));
		}
	}, 250);

	_handleMenuToggle = (open) => {
		if (open) {
			this._loadList([]);
		}
	};

	_handleChange = (value) => {
		this.props.onChange(value);
		// this.props.dispatch(EntityDuck.setList(undefined, this.props.alias));
	};


	morePlugin = ({style, onClick}) => {
		return <MoreVertIcon
			key="more-vert"
			color={colors.disabled}
			hoverColor={colors.info}
			onClick={() => onClick(() => alert('More'))}
			style={{ ...style, width: '18px', height: '18px' }}
		/>;
	};

	addCirclePlugin = ({style, isTyping, searchText, onClick}) => {
		if (this.props.notFound && isTyping) {
			return <AddCircleIcon
				key="add-circle"
				color={colors.disabled}
				hoverColor={colors.info}
				onClick={() => onClick(() => alert(searchText))}
				style={{ ...style, width: '18px', height: '18px' }}
			/>;
		}
		return null;
	};


render() {
		const { alias, entityType, value } = this.props;
		const isValue = value !== undefined && value !== null;
		const list = toJS(this.props.list);
		let entity = toJS(this.props.entity);
		if (isValue) {
			// TODO replace != with !== for Flexi API
			if (!entity || entity.id != value ) { // eslint-disable-line eqeqeq
				this.props.dispatch(EntityDuck.findEntityById(entityType, value, alias));
				entity = undefined;
			}
		} else {
			entity = undefined;
		}
		return (
			<DropdownInput
				{ ...this.props }
				entityToValue={e => e.id}
				onFilterChange={this._handleFilterChange}
				onMenuToggle={this._handleMenuToggle}
				onChange={this._handleChange}
				filter={AutoComplete.noFilter}
				data={list || []}
				entity={entity}
				plugins={[this.morePlugin, this.addCirclePlugin]}
			/>
		);
	}
}

export default connect(
	(state, props) => ({
		entity: EntityDuck.getEntity(state, props.alias),
		list: EntityDuck.getList(state, props.alias),
		notFound: EntityDuck.getNotFound(state, props.alias)
	})
)(EntityInput);
