import { Collection } from 'mongodb';
import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account-mongo-repository';

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

	test('Should return null on if loadByEmail fails', async () => {
		const sut = makeSut();

		const account = await sut.loadByEmail('any_email@email.com');
		expect(account).toBeFalsy();
	});

	test('Should update the account accessToken on updateAccessToken success', async () => {
		const sut = makeSut();
		const res = await accountCollection.insertOne({
			name: 'any_name',
			email: 'any_email@email.com',
			password: 'hash_password'
		});
		const fakeAccount = res.ops[0];

		expect(fakeAccount.accessToken).toBeFalsy();
		await sut.updateAccessToken(fakeAccount.accessToken, 'hash_password');
		const account = await accountCollection.findOne({ _id: fakeAccount._id });
		expect(account).toBeTruthy();
		expect(account.password).toBe('hash_password');
	});
});
