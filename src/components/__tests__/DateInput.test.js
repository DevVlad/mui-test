const { parseDate } = require('../DateInput.js')._private;

describe('date parser', () => {
	const currentYear = new Date().getFullYear();
	const currentMonth = new Date().getMonth();
	it('parses full date', () => {
		process.env.TZ = 'UTC';
		expect(parseDate(['D', 'M', 'Y'], '15 7 2016')).toEqual(new Date(2016, 6, 15));
	});
	it('parses day and month', () => {
		process.env.TZ = 'UTC';
		expect(parseDate(['D', 'M'], '15 7')).toEqual(new Date(currentYear, 6, 15));
		expect(parseDate(['D', 'M'], '15 7 1999')).toEqual(new Date(currentYear, 6, 15));
	});
	it('parses day only', () => {
		process.env.TZ = 'UTC';
		expect(parseDate(['D'], '15')).toEqual(new Date(currentYear, currentMonth, 15));
		expect(parseDate(['D'], '15 1')).toEqual(new Date(currentYear, currentMonth, 15));
		expect(parseDate(['D'], '15 1 1999')).toEqual(new Date(currentYear, currentMonth, 15));
	});
});
