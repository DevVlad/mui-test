const { transformToNumber, getParsersFromString, getUniqueElemFromArray } = require('../NumberInput.js')._private;

describe('NumberInput function tests', () => {
	it('transformToNumber', () => {
		expect(transformToNumber('1 245.36', '.')).toEqual(1245.36);
		expect(transformToNumber('1 245 569.36', '.')).toEqual(1245569.36);
		expect(transformToNumber('1,245,36.23', '.')).toEqual(124536.23);
		expect(transformToNumber('1 000 000', '.')).toEqual(1000000);
		expect(transformToNumber('1,245.36 56', '.')).toEqual(1245.36);
	});

	it('getParsersFromString', () => {
		expect(getParsersFromString('10 0/2*9-8+9')).toEqual([" ", "/", "*", "-", "+"]);
	});

	it('getUniqueElemFromArray', () => {
		expect(getUniqueElemFromArray([" ", " ", "."])).toEqual('.');
		expect(getUniqueElemFromArray([" ", ".", ".", " "])).toEqual(undefined);
	});
});
