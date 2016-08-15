import React, { PropTypes } from 'react';
import AutoComplete from './material-ui/AutoComplete.js';
import { transformProps, colors } from './utils/material.js';
import ClearIcon from 'material-ui/svg-icons/content/clear';
import lodash from 'lodash';

class DropdownInput extends React.Component {

	static propTypes = {
		label: PropTypes.string,
		value: PropTypes.any,
		data: PropTypes.array,
		disabled: PropTypes.bool,
		errorText: PropTypes.string,
		entityToText: PropTypes.func,
		entityToValue: PropTypes.func,
		onChange: PropTypes.func,
		onFilterChange: PropTypes.func,
		onBlur: PropTypes.func,
		onMenuToggle: PropTypes.func,
		entity: PropTypes.object,
		plugins: PropTypes.arrayOf(PropTypes.func)
	};

	static defaultProps = {
		data: ['no data'],
		entityToText: e => e,
		entityToValue: e => e,
		onChange: () => {},
		onFilterChange: () => {},
		plugins: []
	};

	constructor() {
		super();
		this.state = {};
	}

	focus() {
		setTimeout(() => { this._input.focus() }, 0);
	}

	_getEntityText(entity) {
		return entity ? this.props.entityToText(entity) : '';
	}

	_getEntityValue(entity) {
		return entity ? this.props.entityToValue(entity) : null;
	}

	_findEntity(value) {
		const found = this.props.data.filter(e => this._getEntityValue(e) === value);
		return found.length > 0 ? found[0] : undefined;
	}

	_handleSelect(searchText, index) {
		if (index >= 0) {
			this.props.onChange(this._getEntityValue(this.props.data[index]));
		}
		this.setState({ searchText: undefined, clearText: undefined });
		this.focus();
	}

	_handleInput(searchText) {
		this.props.onFilterChange(searchText);
		this.setState({ searchText, clearText: searchText === '' });
	}

	_handleBlur(e) {
		this.blurTimeout = setTimeout(() => {
			if (!this.state.menuShow) {
				if (this.state.clearText) {
					this.props.onChange(null);
				}
				this.setState({ searchText: undefined, clearText: undefined });
			}
		}, 200);
	}

	_handleKeyDown(e) {
		let state = {};
		let menuShow = e.keyCode === 40; // Down
		if (menuShow !== this.state.menuShow) {
			state = { menuShow };
		}
		if (e.keyCode === 27) { // Escape
			state = { ...state, searchText: undefined, menuShow: undefined };
		}
		if (!lodash.isEmpty(state)) this.setState(state);
	}

	_handleMenuKeyDown(e) {
		let state = {};
		if (e.keyCode === 27) { // Escape
			state = { ...state, searchText: undefined, menuShow: undefined };
			this.focus();
			this.setState(state);
		}
	}

	clearIconPlugin = ({style, isValue, isTyping, onClick}) => {
		if (isValue && !isTyping) {
			return <ClearIcon
				key="clear"
				color={colors.disabled}
				onClick={() => onClick(() => this.props.onChange(null))}
				style={{ ...style, width: '18px', height: '18px' }}
			/>
		}
		return null;
	};

	_getPluginIcons = (variables) => {
		let plugins = [ ...this.props.plugins, this.clearIconPlugin ];
		let icons = [];
		let index = 0;
		plugins.forEach(plugin => {
			const pluginIcon = plugin({
				...variables,
				onClick: (innerOnClick) => {
					clearTimeout(this.blurTimeout);
					innerOnClick();
					this.focus();
				},
				style: { transform: `translate(${-40 * index - 20}px, 5px)` }}
			);
			if (pluginIcon) {
				icons.push(pluginIcon);
				index++;
			}
		});
		return icons;
	};

	render() {
		let searchText = this.state.searchText;
		const isValue = this.props.value !== undefined && this.props.value !== null;
		const isTyping = searchText !== undefined;
		if (!isTyping) {
			if (this.props.entity !== undefined) {
				searchText = this._getEntityText(this.props.entity);
			} else if (isValue) {
				searchText = this._getEntityText(this._findEntity(this.props.value));
			}
		}
		const dataSource = this.props.data.map(e => ({
			value: this._getEntityValue(e),
			text: this._getEntityText(e)
		}));
		const filter = !isTyping ? AutoComplete.noFilter : this.props.filter;
		return (
			<span>
				<AutoComplete
					ref={node => { this._input = node }}
					{ ...transformProps(AutoComplete, this.props) }
					searchText={searchText}
					dataSource={dataSource}
					menuStyle={{ maxHeight: '300px', overflowX: 'hidden' }}
					menuProps={{ onKeyDown: this._handleMenuKeyDown.bind(this)}}
					onNewRequest={this._handleSelect.bind(this)}
					onUpdateInput={this._handleInput.bind(this)}
					onBlur={this._handleBlur.bind(this)}
					onKeyDown={this._handleKeyDown.bind(this)}
					onMenuToggle={this.props.onMenuToggle}
					filter={filter}
					animated={false}
				/>
				{ this._getPluginIcons({searchText, isValue, isTyping}) }
			</span>
		);
	}
}

export default DropdownInput;