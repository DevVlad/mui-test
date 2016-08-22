import expect from 'expect';
import Immutable from 'immutable';
import { wrap } from './wrap.js';

describe('wrap(entity, dictionary) function', () => {
	const e = { id: 123, nazev: 'aaa', castka: 100.00 };
	const f = wrap(e, { nazev: 'name', castka: 'amount' });

  it('init', () => {
		expect(e.id).to.equal(123);
		expect(e.nazev).to.equal('aaa');
		expect(e.castka).to.equal(100.00);
		expect(f.id).to.equal(123);
		expect(f.name).to.equal('aaa');
		expect(f.amount).to.equal(100.00);
  });

	it('id change', () => {
		expect(e.id).to.equal(123);
		expect(f.id).to.equal(123);
		f.id = 234;
		expect(e.id).to.equal(234);
		expect(f.id).to.equal(234);
		e.id = 345;
		expect(e.id).to.equal(345);
		expect(f.id).to.equal(345);
	});

	it('name/nazev change', () => {
		f.name = 'bbb';
		expect(e.nazev).to.equal('bbb');
		expect(f.name).to.equal('bbb');
		e.nazev = 'ccc';
		expect(e.nazev).to.equal('ccc');
		expect(f.name).to.equal('ccc');
	});

	it('amount/castka change', () => {
		f.amount = 200.45;
		expect(e.castka).to.equal(200.45);
		expect(f.amount).to.equal(200.45);
		e.castka = 'ccc';
		expect(e.castka).to.equal('ccc');
		expect(f.amount).to.equal('ccc');
	});

});
