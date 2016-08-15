import Immutable from 'immutable';
import buildConstants from '../buildConstants.js';
import { createSelector } from 'reselect';
import superagent from 'superagent';

export const EntityDuck = {
	name: 'entity'
};

// const getOwnState = state => state.get(EntityDuck.name);
const getAliasState = (state, alias) => state.getIn([EntityDuck.name, alias]);

const initialState = Immutable.fromJS({});

const actionTypes = {
	[EntityDuck.name]: {
		setEntity: 'SET_ENTITY',
		setList: 'SET_LIST',
		filterList: 'FILTER_LIST'
	}
};

const actions = buildConstants(actionTypes);

EntityDuck.findEntityById = (entityType, id, alias) => {
	return dispatch => {
		// TODO will be replaced with DAO
		serviceFindById(entityType, id).then(entity => {
			dispatch(EntityDuck.setEntity(entity, alias));
		});
	};
};

EntityDuck.listByCondition = (entityType, condition, alias) => {
	return (dispatch, getState) => {
		const expr = conditionToExpression(condition);
		let list = EntityDuck.getList(getState(), alias);
		if (list) {
			const ids = list.filter(e => expr(e)).map(e => e.get('id'));
			dispatch(EntityDuck.filterList(ids, alias));
		}
		// TODO will be replaced with DAO
		serviceListByCondition(entityType, condition).then(list => {
			dispatch(EntityDuck.setList(list, alias));
		});
	};
};

EntityDuck.setEntity = (entity, alias) => {
	return {
		type: actions.entity.setEntity,
		entity,
		alias
	}
};

EntityDuck.setList = (list, alias) => {
	return {
		type: actions.entity.setList,
		list,
		alias
	}
};

EntityDuck.filterList = (ids, alias) => {
	return {
		type: actions.entity.filterList,
		ids,
		alias
	}
};

EntityDuck.reducer = (state = initialState, action) => {
	switch (action.type) {
		case actions.entity.setEntity: {
			return state
				.setIn([action.alias, 'entity'], Immutable.fromJS(action.entity))
				.setIn([action.alias, 'list'], Immutable.fromJS(action.list))
				.setIn([action.alias, 'notFound'], false);
		}
		case actions.entity.setList: {
			return state
				.setIn([action.alias, 'list'], Immutable.fromJS(action.list))
				.setIn([action.alias, 'notFound'], action.list.length === 0);
		}
		case actions.entity.filterList: {
			return state.updateIn([action.alias, 'list'], list => {
				return list.filter(e => action.ids.indexOf(e.get('id')) >= 0);
			})
		}
		default: return state;
	}
};

EntityDuck.getEntity = createSelector(
	getAliasState,
	state => (state !== undefined) ? state.get('entity') : state
);

EntityDuck.getList = createSelector(
	getAliasState,
	state => (state !== undefined) ? state.get('list') : state
);

EntityDuck.getNotFound = createSelector(
	getAliasState,
	state => (state !== undefined) ? state.get('notFound') : state
);


function serviceFindById(entityType, id) {
	const query = {
		// 'add-row-count': true,
		'start': 0,
		'limit': 20
	};
	return new Promise((resolve, reject) => {
		superagent.get(`https://nejlepsi.flexibee.eu/c/velka/${entityType}/${id}`)
			.set('Accept', 'application/json')
			.auth('admin', 'adminadmin')
			.query(query)
			.end((err, res)=> {
				if (!err) {
					resolve(res.body);
				} else {
					console.error('Error ApiService - ContactDropdown: ', err);
				}
			})
	}).then(response => {
		return response.winstrom[entityType][0];
	});
}

function conditionToExpression(condition) {
	let expression = 'true';
	if (condition) {
		expression = condition.map(cond =>
			`(arg.get('${cond.left}').toLowerCase().indexOf('${cond.right.toLowerCase()}') >= 0)`
		).join(' || ');
	}
	return (arg) => {
		return eval(expression);
	}
}

function conditionToFilter(condition) {
	let filter = '';
	if (condition) {
		filter = condition.map(cond => `(${cond.left} like similar '${cond.right}')`).join(' or ');
		filter = `(${encodeURIComponent(filter)})`;
	}
	return filter;
}

function serviceListByCondition(entityType, condition) {
	let query = {
		// 'add-row-count': true,
		'start': 0,
		'limit': 10
	};
	const filter = conditionToFilter(condition);
	return new Promise((resolve, reject) => {
		superagent.get(`https://nejlepsi.flexibee.eu/c/velka/${entityType}/${filter}`)
			.set('Accept', 'application/json')
			.auth('admin', 'adminadmin')
			.query(query)
			.end((err, res)=> {
				if (!err) {
					resolve(res.body);
				} else {
					console.error('Error ApiService - ContactDropdown: ', err);
				}
			})
	}).then(response => {
		return response.winstrom[entityType];
	})
}
