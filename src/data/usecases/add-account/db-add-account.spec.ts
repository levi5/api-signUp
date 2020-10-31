import { IEncrypter, IAccountModel, IAddAccountModel, IAddAccountRepository } from './db-add-account-protocols';
import { DbAddAccount } from './db-add-account';

interface SutTypes{
    sut: DbAddAccount,
	encrypterStub: IEncrypter,
	addAccountRepositoryStub: IAddAccountRepository,
}

const makeEncrypter = (): IEncrypter => {
	class EncrypterStub implements IEncrypter {
		async encrypt (password:string): Promise<string> {
			return new Promise(resolve => resolve('hash_password'));
		}
	}
	return new EncrypterStub();
};

const makeAddAccountRepository = (): IAddAccountRepository => {
	class AddAccountRepositoryStub implements IAddAccountRepository {
		async add (accountData:IAddAccountModel): Promise<IAccountModel> {
			return new Promise(resolve => resolve(makeFakeAccount()));
		}
	}
	return new AddAccountRepositoryStub();
};

const makeFakeAccount = ():IAccountModel => (
	{
		id: 'valid_id',
		name: 'valid_name',
		email: 'valid_email@email.com',
		password: 'any_password'
	}
);

const makeFakeAccountData = ():IAddAccountModel => (
	{
		name: 'valid_name',
		email: 'valid_email@email.com',
		password: 'valid_password'
	}
);

const makeSut = ():SutTypes => {
	const addAccountRepositoryStub = makeAddAccountRepository();
	const encrypterStub = makeEncrypter();
	const sut = new DbAddAccount(encrypterStub, addAccountRepositoryStub);

	return {
		sut,
		encrypterStub,
		addAccountRepositoryStub
	};
};
describe('DbAddAccount UseCase', () => {
	test('Should call Encrypter with correct password', async () => {
		const { sut, encrypterStub } = makeSut();
		const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt');
		await sut.add(makeFakeAccountData());
		expect(encrypterSpy).toHaveBeenCalledWith('valid_password');
	});

	test('Should throw if Encrypter throws', async () => {
		const { sut, encrypterStub } = makeSut();
		jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));

		const promise = sut.add(makeFakeAccountData());
		expect(promise).rejects.toThrow();
	});

	test('Should call AddAccountRepository with correct values', async () => {
		const { sut, addAccountRepositoryStub } = makeSut();
		const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
		await sut.add(makeFakeAccountData());
		expect(addSpy).toHaveBeenCalledWith({
			name: 'valid_name',
			email: 'valid_email@email.com',
			password: 'hash_password'
		});
	});

	test('Should throw if AddAccountRepository throws', async () => {
		const { sut, addAccountRepositoryStub } = makeSut();
		jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
		const accountData = {
			name: 'valid_name',
			email: 'valid_email@email.com',
			password: 'hash_password'
		};
		const promise = sut.add(accountData);
		expect(promise).rejects.toThrow();
	});

	test('Should return an account on success', async () => {
		const { sut } = makeSut();
		const account = await sut.add(makeFakeAccountData());
		expect(account).toEqual(makeFakeAccount());
	});
});
