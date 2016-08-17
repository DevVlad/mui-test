import { blue500, red500, grey500, orange500, green500, grey900 } from 'material-ui/styles/colors';

export const colors = {
	info: blue500,
	error: red500,
	disabled: grey500,
	warning: orange500,
	pass: green500,
	normal: grey900
};

export const transformProps = (component, props) => {
	let newProps = {};
	if (component.propTypes.checked && props.value) {
		newProps = { ...newProps, checked: props.value }
	}
	if (component.propTypes.defaultToggled && props.value) {
		newProps = {...newProps, defaultToggled: props.value  };
	}
	if (component.propTypes.floatingLabelText && props.label) {
		newProps = { ...newProps, floatingLabelText: props.label }
	}
	if (component.propTypes.disabled && props.disabled) {
		newProps = {...newProps, disabled: props.disabled  };
	}
	if (component.propTypes.errorText) {
		if (props.errorText) {
			newProps = {
				...newProps,
				errorText: props.errorText,
				errorStyle: { color: colors.error }
			}
		} else if (props.warnText) {
			newProps = {
				...newProps,
				errorText: props.warnText,
				errorStyle: { color: colors.warning }
			}
		} else if (props.passText) {
			newProps = {
				...newProps,
				errorText: props.passText,
				errorStyle: { color: colors.pass }
			}
		}
		newProps = {
			...newProps,
			errorStyle: {
				...newProps.errorStyle,
				fontSize: 12,
				width: 'inherit'
			}
		}
	}
	return newProps;
};
