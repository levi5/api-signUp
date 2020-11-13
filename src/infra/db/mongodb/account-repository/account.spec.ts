import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account';

const makeSut = ():any => {
	return new AccountMongoRepository();
};

let accountCollection:Collection;

describe('Account Mongo Repository', () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL);
	});

	beforeEach(async () => {
		accountCollection = await MongoHelper.getCollection('accounts');
		await accountCollection.deleteMany({});
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	test('Should return an account on add success', async () => {
		const sut = makeSut();
		const account = await sut.add({
			name: 'any_name',
			email: 'any_email@email.com',
			password: 'hash_password'
		});

		expect(account).toBeTruthy();
		expect(account.id).toBeTruthy();
		expect(account.name).toBe('any_name');
		expect(account.email).toBe('any_email@email.com');
	});

	test('Should return an account on loadByEmail success', async () => {
		const sut = makeSut();
		await accountCollection.insertOne({
			name: 'any_name',
			email: 'any_email@email.com',
			password: 'hash_password'
		});
		const account = await sut.loadByEmail('any_email@email.com');
		expect(account).toBeTruthy();
		expect(account.id).toBeTruthy();
		expect(account.name).toBe('any_name');
		expect(account.email).toBe('any_email@email.com');
	});
});
