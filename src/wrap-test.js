import expect from 'expect';
import { wrap } from './wrap.js';

describe('wrap(entity, dictionary) function', () => {
	const e = { id: 123, nazev: 'aaa', castka: 100.00 };
	const f = wrap(
		e,
		{
			nazev: 'name',
			castka: 'amount' ,
			object: 'object',
			adresa: 'address',
			mesto: 'city',
			jmeno: 'firstname',
			prijmeni: 'surname'
		}
	);

  it('init', () => {
		expect(e.id).toEqual(123);
		expect(e.nazev).toEqual('aaa');
		expect(e.castka).toEqual(100.00);
		expect(f.id).toEqual(123);
		expect(f.name).toEqual('aaa');
		expect(f.amount).toEqual(100.00);
  });

	it('id change', () => {
		expect(e.id).toEqual(123);
		expect(f.id).toEqual(123);
		f.id = 234;
		expect(e.id).toEqual(234);
		expect(f.id).toEqual(234);
		e.id = 345;
		expect(e.id).toEqual(345);
		expect(f.id).toEqual(345);
	});

	it('name/nazev change', () => {
		f.name = 'bbb';
		expect(e.nazev).toEqual('bbb');
		expect(f.name).toEqual('bbb');
		e.nazev = 'ccc';
		expect(e.nazev).toEqual('ccc');
		expect(f.name).toEqual('ccc');
	});

	it('amount/castka change', () => {
		f.amount = 200.45;
		expect(e.castka).toEqual(200.45);
		expect(f.amount).toEqual(200.45);
		e.castka = 'ccc';
		expect(e.castka).toEqual('ccc');
		expect(f.amount).toEqual('ccc');
	});

	it('inserting object e -> f', () => {
		e.object = {
			jmeno: 'Pavel',
			prijmeni: 'Novak',
			adresa: 'Za Velkym Kopcem, 645'
		};
		expect(f.object.firstname).toEqual(e.object.jmeno);
		expect(f.object.surname).toEqual(e.object.prijmeni);
		expect(f.object.address).toEqual(e.object.adresa);
	});

	it('inserting object f -> e', () => {
		f.object = {
			firstname: 'Lojza',
			surname: 'Prihradka',
			address: 'Za Malym Splavem, 6'
		};
		expect(f.object.firstname).toEqual(e.object.jmeno);
		expect(f.object.surname).toEqual(e.object.prijmeni);
		expect(f.object.address).toEqual(e.object.adresa);
	});

	it('unknown record in dictionary', () => {
		f.object = {
			firstname: 'Lojza',
			surname: 'Prihradka',
			address: 'Za Malym Splavem, 6',
			stav: 'nezadany'
		};
		expect(f.object.stav).toEqual(e.object.stav);
	});


});
