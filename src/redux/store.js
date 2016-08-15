import { createStore, applyMiddleware, compose } from 'redux';
import { combineReducers } from 'redux-immutable';
import reduxThunk from 'redux-thunk';
import { Map as immutableMap } from 'immutable';
import TestDuck from './ducks/TestDuck.js';
import { EntityDuck } from './ducks/EntityDuck.js';

const combineDucks = (...ducks) => combineReducers(
	ducks.reduce((root, duck) => (
		{ ...root, [duck.name]: duck.reducer }
	), {}));

const initialState = immutableMap();

const rootReducer = combineDucks(
	TestDuck,
	EntityDuck
);

const reduxDevToolExtension = window.devToolsExtension ? window.devToolsExtension() : f => f;

export const store = createStore(
	rootReducer,
	initialState,
	compose(applyMiddleware(reduxThunk), reduxDevToolExtension)
);
