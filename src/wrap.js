import Immutable from 'immutable';

export const wrap = (entity, dictionary, nestedKeys = [], wrapedEntity = Immutable.fromJS({})) => {
	const iEntity = Immutable.fromJS(entity);
	let nestingKeys = nestedKeys.slice(0);
	let outputEntity = Immutable.fromJS({});
	Object.keys(entity).forEach( key => {
		if (!Immutable.Iterable.isKeyed(iEntity.get(key))) {
			outputEntity = outputEntity.set(translateKey(key, dictionary), iEntity.get(key));
		} else {
			nestingKeys.push(key);
			outputEntity = outputEntity.set(translateKey(key, dictionary));
		}
	});
	wrapedEntity = saveToWrapedEntity(outputEntity, nestedKeys, wrapedEntity);
	if (!Immutable.fromJS(nestedKeys).equals(Immutable.fromJS(nestingKeys))) {
		const nestingKey = nestingKeys[nestingKeys.length - 1];
		const translatedNestedKey = translateKey(nestingKey, dictionary);
		const translatedNestingKeys = nestingKeys.map(key => translateKey(key, dictionary));
		if (entity[nestingKey]) {
			wrap(entity[nestingKey], dictionary, translatedNestingKeys, wrapedEntity);
		}
	} else {
		console.log(wrapedEntity.toJS());
		return wrapedEntity.toJS();
	}
};

const translateKey = (key, dictionary) => dictionary.get(key) || key;

const saveToWrapedEntity = (entity, nestedKeys, wrapedEntity) => {
	if (nestedKeys && nestedKeys.length > 0) {
		return wrapedEntity.setIn(nestedKeys, entity);
	} else {
		return entity;
	}
};
