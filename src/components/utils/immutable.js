/**
 * Created by mase on 12.8.16.
 */

export const toJS = (value) => {
	if (value !== undefined && value !== null && (typeof value.toJS === 'function')) {
		return value.toJS();
	}
	return value;
};
