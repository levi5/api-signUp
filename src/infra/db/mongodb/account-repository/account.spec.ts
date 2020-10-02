import { IAddAccountRepository } from '../../../../data/protocols/add-account-repository';
import { MongoHelper } from '../helpers/mongo-helper';
import { AccountMongoRepository } from './account';

const makeSut = ():IAddAccountRepository => {
	return new AccountMongoRepository();
};

describe('Account Mongo Repository', () => {
	beforeAll(async () => {
		await MongoHelper.connect(process.env.MONGO_URL);
	});

	beforeEach(async () => {
		const accountCollection = await MongoHelper.getCollection('accounts');
		await accountCollection.deleteMany({});
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	test('Should return an account on success', async () => {
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
});
