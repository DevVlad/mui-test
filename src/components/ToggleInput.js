import React, { PropTypes } from 'react';
import Toggle from 'material-ui/Toggle';

import { transformProps } from './utils/material.js';
import PureComponent from 'react-pure-render/component';
import ErrorLabel from './ErrorLabel.js';

class ToggleInput extends PureComponent{
	static propTypes = {
		label: PropTypes.string,
		onBlur: PropTypes.func,
		onChange: PropTypes.func,
		value: PropTypes.bool,
		warnText: PropTypes.string,
		errorText: PropTypes.string,
	};

	static defaultProps = {
		onChange: () => {},
		onBlur: () => {},
		labelPosition: "right"
	};

	render() {
		const { value, label, labelPosition } = this.props;
		return (
			<div>
				<Toggle
					{ ...transformProps(Toggle, this.props) }
					value={value}
					label={label}
					labelPosition={labelPosition}
					onBlur={ () => this.props.onBlur(this.props.value) }
					onToggle={ () => this.props.onChange(!this.props.value) }
				/>
				<ErrorLabel
					{...transformProps(ErrorLabel, this.props)}
				/>
			</div>
		);
	}
}

export default ToggleInput;
