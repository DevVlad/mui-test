import Immutable from 'immutable';
import buildConstants from '../buildConstants.js';
import { createSelector } from 'reselect';
import lodash from 'lodash';
import { toJS } from '../../components/utils/immutable.js';

const TestDuck = {
	name: 'test'
};

const getOwnState = state => state.get(TestDuck.name);

const initialState = Immutable.fromJS({});

const actionTypes = {
	test: {
		setValue: 'SET_VALUE'
	}
};

const actions = buildConstants(actionTypes);

TestDuck.reducer = (state = initialState, action) => {
	switch (action.type) {
		case actions.test.setValue: {
			return state.set(action.name, action.value);
		}
		default: return state;
	}
};

TestDuck.setValue = (name, value) => ({
	type: actions.test.setValue,
	name,
	value
});

TestDuck.getValue = (name) => createSelector(
	getOwnState,
	state => (state !== undefined) ? state.get(name) : state
);

TestDuck.mapStateToProps = (...names) => (state) => {
	return names.reduce((root, name) => {
		root[name] = TestDuck.getValue(name)(state);
		return root;
	}, {});
};

TestDuck.mapDispatchToProps = (...names) => {
	return names.reduce((root, name) => {
		root[`set${lodash.upperFirst(name)}`] = (value) => TestDuck.setValue(name, value);
		return root;
	}, {});
};

TestDuck.connect = (...names) => [
	TestDuck.mapStateToProps(...names),
	TestDuck.mapDispatchToProps(...names)
];

export default TestDuck;
