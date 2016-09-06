import NumberInput from '../NumberInput.js';
const { transformToNumber, getParsersFromString, getUniqueElemFromArray } = require('../NumberInput.js')._private;

describe('NumberInput function tests', () => {

	it('getUniqueElemFromArray', () => {
		expect(getUniqueElemFromArray([" ", " ", "."])).toEqual('.');
		expect(getUniqueElemFromArray([" ", ".", ".", " "])).toEqual(undefined);
	});

	it('transformToNumber', () => {
		expect(transformToNumber(' 1 245.36', '.')).toEqual(1245.36);
		expect(transformToNumber('1 245 569.36', '.')).toEqual(1245569.36);
		expect(transformToNumber('1,245,36.23', '.')).toEqual(124536.23);
		expect(transformToNumber('1 000 000', '.')).toEqual(1000000);
		expect(transformToNumber('1,245.36 56', '.')).toEqual(1245.36);
	});

	it('getParsersFromString', () => {
		expect(getParsersFromString('10 0/2*9-8+9')).toEqual([" ", "/", "*", "-", "+"]);
	});

	it('tryCalculateString', () => {
		const ni = new NumberInput();
		let a = '10+8/2+1';
		expect(ni.tryCalculateString(a, getParsersFromString(a))).toEqual(15);

		a = '  10/2 + 5,00 * 2';
		expect(ni.tryCalculateString(a, getParsersFromString(a))).toEqual(15);

		a = '  10/2 + 5,75 + 4.25';
		expect(ni.tryCalculateString(a, getParsersFromString(a))).toEqual(15);

		a = '1\'000\'000+20- 10';
		expect(ni.tryCalculateString(a, getParsersFromString(a))).toEqual(1000010);
	});

});
