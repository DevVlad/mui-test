import React, { PropTypes } from 'react';
import Toggle from 'material-ui/Toggle';
import stylePropType from 'react-style-proptype';
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
		style: stylePropType
	};

	static defaultProps = {
		onChange: () => {},
		onBlur: () => {},
		labelPosition: "right",
		style: { width: '256px' }
	};

	render() {
		const { value, label, labelPosition } = this.props;
		return (
			<div style={{...this.props.style}}>
				<Toggle
					{ ...transformProps(Toggle, this.props) }
					// defaultToggled={value}
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
