import React from 'react';
import { Provider } from 'react-redux';

import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import injectTapEventPlugin from 'react-tap-event-plugin';

import { store } from './redux/store.js';
import ComponentsTest from './ComponentsTest.js';

injectTapEventPlugin();

const App = (props) => (
	<Provider store={store}>
		<MuiThemeProvider>
			<ComponentsTest/>
		</MuiThemeProvider>
	</Provider>
);

export default App;
