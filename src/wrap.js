import { flatten, unflatten } from 'flat';
import Immutable from 'immutable';

const translate = (key, dictionary) => {
		return dictionary.get(key) || key;
};

export const wrap = (entity, dictionary) => {
	const dict = Immutable.Map(dictionary).flip();
	const knownProxy = proxyMemory(entity);

	if (!knownProxy) {
		const wrapEnt = (entity) => {
			return new Proxy(entity, {
				get(entity, prop) {
					let result = entity[translate(prop, dict)];
					if (typeof result === 'object') {
						result = wrapEnt(result);
					}
					return result;
				},
				set(entity, prop, val) {
					entity[translate(prop, dict)] = typeof val === 'object' ? wrapEnt(val) : val;
					return true;
				}
			});
		};
		const newProxy = wrapEnt(entity);
		proxyMemory(entity, true, newProxy);
		return newProxy;
	} else {
		return knownProxy;
	}
};

let knownProxies = {};
const proxyMemory = (entity, newRecord, newProxy) => {
	if (!newRecord) {
		return knownProxies[entity.id] || undefined;
	} else {
		knownProxies[entity.id] = newProxy;
	}
};

// export const wrap = (entity, dictionary) => {
// 	const dict = Immutable.Map(dictionary).flip();
//
// 	const wrapEnt = (entity) => {
// 		return new Proxy(entity, {
// 			get(entity, prop) {
// 				let result = entity[translate(prop, dict)];
// 				if (typeof result === 'object') {
// 					result = wrapEnt(result);
// 				}
// 				return result;
// 			},
// 			set(entity, prop, val) {
// 				entity[translate(prop, dict)] = typeof val === 'object' ? wrapEnt(val) : val;
// 				return true;
// 			}
// 		});
// 	};
//
// 	return wrapEnt(entity);
// };

export const translateEntity = (entity, dictionary) => {
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
}

// TOSE consultation
// const dict = Immutable.Map(dictionary).flip();
//
// let wrapF = (entity) => {
// 	return new Proxy(entity, {
// 		get(entity, prop) {
// 			let result = entity[translate(prop, dict)];
// 			if (typeof result === 'object') {
// 				result = wrapF(result);
// 			}
// 			return result;
// 		},
// 		set(entity, prop, val) {
// 			entity[translate(prop, dict)] = val;
// 			return true;
// 		}
// 	});
// };
//
// return wrapF(entity);

//translation
// const flatEntity = flatten(entity);
// const keysOfFlatEntity = Object.keys(flatEntity);
// console.log(flatEntity);
// const translatedKeys = keysOfFlatEntity.map(key => {
// 	return key.split('.').map(keyToTranslate => translate(keyToTranslate, dictionary)).join('.');
// });
// let outputEntity = {};
// translatedKeys.forEach((translatedKey, index) => {
// 	outputEntity[translatedKey] = flatEntity[keysOfFlatEntity[index]];
// });
// return unflatten(outputEntity);
