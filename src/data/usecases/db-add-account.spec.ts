import { DbAddAccount } from './add-account/db-add-account';

describe('DbAddAccount UseCase', () => {
	test('Should call Encrypter with correct password', async () => {
		class EncrypterStub {
			async encrypt (password:string): Promise<string> {
				return new Promise(resolve => resolve('hash_password'));
			}
		}

		const encrypterStub = new EncrypterStub();
		const sut = new DbAddAccount(encrypterStub);
		const encrypterSpy = jest.spyOn(encrypterStub, 'encrypt');
		const accountData = {
			name: 'valid_name',
			email: 'valid_email@email.com',
			password: 'valid_password'
		};
		await sut.add(accountData);
		expect(encrypterSpy).toHaveBeenCalledWith('valid_password');
	});
});
