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
			const fakeAccount = {
				id: 'valid_id',
				name: 'valid_name',
				email: 'valid_email@email.com'
			};
			return new Promise(resolve => resolve(fakeAccount));
		}
	}
	return new AddAccountRepositoryStub();
};

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
		const accountData = {
			name: 'valid_name',
			email: 'valid_email@email.com',
			password: 'valid_password'
		};
		await sut.add(accountData);
		expect(encrypterSpy).toHaveBeenCalledWith('valid_password');
	});

	test('Should throw if Encrypter throws', async () => {
		const { sut, encrypterStub } = makeSut();
		jest.spyOn(encrypterStub, 'encrypt').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
		const accountData = {
			name: 'valid_name',
			email: 'valid_email@email.com',
			password: 'valid_password'
		};
		const promise = sut.add(accountData);
		expect(promise).rejects.toThrow();
	});

	test('Should call AddAccountRepository with correct values', async () => {
		const { sut, addAccountRepositoryStub } = makeSut();
		const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
		const accountData = {
			name: 'valid_name',
			email: 'valid_email@email.com',
			password: 'valid_password'
		};
		await sut.add(accountData);
		expect(addSpy).toHaveBeenCalledWith({
			name: 'valid_name',
			email: 'valid_email@email.com',
			password: 'hash_password'
		});
	});
});
