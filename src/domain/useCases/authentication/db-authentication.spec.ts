import { LoadAccountByEmailRepository } from '../../../data/protocols/load-account-by-email-repository';
import { IAccountModel } from '../../model/account';
import { DbAuthentication } from './db-authentication';

describe('DbAuthentication UseCase', () => {
	test('Should call LoadAccountByEmailRepository with correct email.', async () => {
		class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
			async load (email:string):Promise<IAccountModel> {
				const account:IAccountModel = {
					id: 'any_id',
					name: 'any_name',
					email: 'any_email'
				};
				return new Promise(resolve => resolve(account));
			}
		}

		const loadAccountByEmailRepositoryStub = new LoadAccountByEmailRepositoryStub();
		const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);
		const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');
		await sut.auth({
			email: 'any_mail@mail.com',
			password: 'any_password'
		});
		expect(loadSpy).toHaveBeenCalledWith('any_mail@mail.com');
	});
});
