import { flatten, unflatten } from 'flat';

const translate = (key, dictionary) => {
		return dictionary.get(key) || key;
};

export const wrap = (entity, dictionary) => {
	const flatEntity = flatten(entity);
	const keysOfFlatEntity = Object.keys(flatEntity);
	const translatedKeys = keysOfFlatEntity.map(key => {
		return key.split('.').map(keyToTranslate => translate(keyToTranslate, dictionary)).join('.');
	});
	let outputEntity = {};
	translatedKeys.forEach((translatedKey, index) => {
		outputEntity[translatedKey] = flatEntity[keysOfFlatEntity[index]];
	});
	return unflatten(outputEntity);
};
