const getPluginIcons = (variables, plugins) => {
	let icons = [];
	let index = 0;
	plugins.forEach(plugin => {
		let ntfHelper = 0;
		if (variables.notifications) {
				if (variables.notifications.length < 44) {
					ntfHelper = -35;
				} else {
					ntfHelper = -47;
				}
		}
		// TODO: consult with Martin about width calc over next param
		const pluginIcon = plugin({
			...variables,
			// style: { transform: `translate(${-40 * index - 20}px, 5px)` }
			style: {
				transform: `translate(${-40 * index - 20}px, ${ variables.notifications ? `${ntfHelper}px` : '5px'})`,
				transitionDuration: '0ms',
			}
		});
		if (pluginIcon) {
			icons.push(pluginIcon);
			index++;
		}
	});
	return icons;
};

export default getPluginIcons;
