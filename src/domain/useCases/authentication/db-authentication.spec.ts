import { LoadAccountByEmailRepository } from '../../../data/protocols/load-account-by-email-repository';
import { IAccountModel } from '../../model/account';
import { IAuthenticationModel } from '../authentication';

import { DbAuthentication } from './db-authentication';

interface SutTypes {
    sut:DbAuthentication,
    loadAccountByEmailRepositoryStub:LoadAccountByEmailRepository
}

const makeFakeAccount = ():IAccountModel => (
	{
		id: 'any_id',
		name: 'any_name',
		email: 'any_email'
	}
);
const makeFakeAuthentication = ():IAuthenticationModel => (
	{
		email: 'any_mail@mail.com',
		password: 'any_password'
	}
);

const makeLoadAccountByEmailRepositoryStub = ():LoadAccountByEmailRepository => {
	class LoadAccountByEmailRepositoryStub implements LoadAccountByEmailRepository {
		async load (email:string):Promise<IAccountModel> {
			return new Promise(resolve => resolve(makeFakeAccount()));
		}
	}
	return new LoadAccountByEmailRepositoryStub();
};

const makeSut = ():SutTypes => {
	const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub();
	const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);

	return {
		sut,
		loadAccountByEmailRepositoryStub
	};
};

describe('DbAuthentication UseCase', () => {
	test('Should call LoadAccountByEmailRepository with correct email.', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut();
		const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');
		await sut.auth(makeFakeAuthentication());
		expect(loadSpy).toHaveBeenCalledWith('any_mail@mail.com');
	});

	test('Should throw if LoadAccountByEmailRepository throws.', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut();
		jest.spyOn(loadAccountByEmailRepositoryStub, 'load').mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
		const promise = sut.auth(makeFakeAuthentication());
		await expect(promise).rejects.toThrow();
	});
});
