import { IEncrypter } from '../protocols/encrypter';
import { DbAddAccount } from './add-account/db-add-account';

interface SutTypes{
    sut: DbAddAccount,
    encrypterStub: IEncrypter,
}

const makeEncrypter = (): IEncrypter => {
	class EncrypterStub implements IEncrypter {
		async encrypt (password:string): Promise<string> {
			return new Promise(resolve => resolve('hash_password'));
		}
	}
	return new EncrypterStub();
};

const makeSut = ():SutTypes => {
	const encrypterStub = makeEncrypter();
	const sut = new DbAddAccount(encrypterStub);

	return {
		sut,
		encrypterStub
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
});
