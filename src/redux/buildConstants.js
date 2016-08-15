export default function buildConstants(actions, prefix) {
	const _prefix = prefix || '';
	const builtActions = {};

	Object.keys(actions).forEach(prop => {
		if (typeof actions[prop] !== 'object') {
			builtActions[prop] = `${_prefix}${prop.toUpperCase()}`;
		} else {
			builtActions[prop] = buildConstants(actions[prop], `${_prefix}${prop.toUpperCase()}_`);
		}
	});

	return Object.freeze(builtActions);
}
