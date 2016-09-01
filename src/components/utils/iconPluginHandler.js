import React from 'react';

const getPluginIcons = (variables, plugins) => {
	let icons = [];
	let index = 0;
	plugins.forEach(plugin => {
		const pluginIcon = plugin({
			...variables,
			// style: { transform: `translate(${-40 * index - 20}px, 5px)` }
			style: {
			// 	transform: `translate(${-40 * index - 20}px, ${ variables.notifications ? '-35px' : '5px'})`,
			// 	transitionDuration: '0ms'
			}
		});
		if (pluginIcon) {
			icons.push(pluginIcon);
			index++;
		}
	});
	return (
		<div style={{
				float: 'right',
				position: 'relative',
				top: '-45px'}}>
			{icons.reverse()}
		</div>
	);
};

export default getPluginIcons;
