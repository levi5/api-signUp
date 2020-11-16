import { DbAuthentication } from './db-authentication';

import {
	IAccountModel,
	IAuthenticationModel,
	IHashComparer, LoadAccountByEmailRepository,
	IEncrypter, IUpdateAccessTokenRepository
} from './db-authentication-protocols';

interface SutTypes {
    sut:DbAuthentication,
	loadAccountByEmailRepositoryStub:LoadAccountByEmailRepository
	hashComparerStub:IHashComparer,
	encrypterStub: IEncrypter,
	updateAccessTokenRepositoryStub:IUpdateAccessTokenRepository
}

const makeFakeAccount = ():IAccountModel => (
	{
		id: 'any_id',
		name: 'any_name',
		email: 'any_email',
		password: 'hashed_password'
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
		async loadByEmail (email:string):Promise<IAccountModel> {
			return new Promise(resolve => resolve(makeFakeAccount()));
		}
	}
	return new LoadAccountByEmailRepositoryStub();
};

const makeHashComparerStub = ():IHashComparer => {
	class HashComparerStub implements IHashComparer {
		async compare (value:string, hash:string):Promise<boolean> {
			return new Promise(resolve => resolve(true));
		}
	}
	return new HashComparerStub();
};

const makeEncrypterStub = ():IEncrypter => {
	class EncrypterStub implements IEncrypter {
		async encrypt (value:string):Promise<string> {
			return new Promise(resolve => resolve('any_token'));
		}
	}
	return new EncrypterStub();
};

const makeUpdateAccessTokenRepositoryStub = ():IUpdateAccessTokenRepository => {
	class UpdateAccessTokenRepository implements IUpdateAccessTokenRepository {
		async updateAccessToken (id:string, token:string):Promise<void> {
			return new Promise(resolve => resolve());
		}
	}
	return new UpdateAccessTokenRepository();
};

const makeSut = ():SutTypes => {
	const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepositoryStub();
	const hashComparerStub = makeHashComparerStub();
	const encrypterStub = makeEncrypterStub();
	const updateAccessTokenRepositoryStub = makeUpdateAccessTokenRepositoryStub();
	const sut = new DbAuthentication(hashComparerStub, loadAccountByEmailRepositoryStub, encrypterStub, updateAccessTokenRepositoryStub);

	return {
		sut,
		loadAccountByEmailRepositoryStub,
		hashComparerStub,
		encrypterStub,
		updateAccessTokenRepositoryStub
	};
};

describe('DbAuthentication UseCase', () => {
	test('Should call LoadAccountByEmailRepository with correct email.', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut();
		const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail');
		await sut.auth(makeFakeAuthentication());
		expect(loadSpy).toHaveBeenCalledWith('any_mail@mail.com');
	});

	test('Should throw if LoadAccountByEmailRepository throws.', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut();
		jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail')
			.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
		const promise = sut.auth(makeFakeAuthentication());
		await expect(promise).rejects.toThrow();
	});

	test('Should return null if LoadAccountByEmailRepository returns null.', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut();
		jest.spyOn(loadAccountByEmailRepositoryStub, 'loadByEmail').mockReturnValueOnce(null);
		const accessToken = await sut.auth(makeFakeAuthentication());
		expect(accessToken).toBeNull();
	});

	test('Should call hashComparer with correct values.', async () => {
		const { sut, hashComparerStub } = makeSut();
		const loadSpy = jest.spyOn(hashComparerStub, 'compare');
		await sut.auth(makeFakeAuthentication());
		expect(loadSpy).toHaveBeenCalledWith('any_password', 'hashed_password');
	});

	test('Should throw if hashComparer throws.', async () => {
		const { sut, hashComparerStub } = makeSut();
		jest.spyOn(hashComparerStub, 'compare')
			.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
		const promise = sut.auth(makeFakeAuthentication());
		await expect(promise).rejects.toThrow();
	});

	test('Should return null if hashComparer returns false.', async () => {
		const { sut, hashComparerStub } = makeSut();
		jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(new Promise(resolve => resolve(false)));
		const accessToken = await sut.auth(makeFakeAuthentication());
		expect(accessToken).toBeNull();
	});

	test('Should call Encrypter with correct id.', async () => {
		const { sut, encrypterStub } = makeSut();
		const encryptSpy = jest.spyOn(encrypterStub, 'encrypt');
		await sut.auth(makeFakeAuthentication());
		expect(encryptSpy).toHaveBeenCalledWith('any_id');
	});

	test('Should throw if Encrypter throws.', async () => {
		const { sut, encrypterStub } = makeSut();
		jest.spyOn(encrypterStub, 'encrypt')
			.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
		const promise = sut.auth(makeFakeAuthentication());
		await expect(promise).rejects.toThrow();
	});

	test('Should return a token on success.', async () => {
		const { sut } = makeSut();
		const accessToken = await sut.auth(makeFakeAuthentication());
		expect(accessToken).toBe('any_token');
	});

	test('Should call UpdateAccessTokenRepository with correct values.', async () => {
		const { sut, updateAccessTokenRepositoryStub } = makeSut();
		const updateSpy = jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken');
		await sut.auth(makeFakeAuthentication());
		expect(updateSpy).toHaveBeenCalledWith('any_id', 'any_token');
	});
	test('Should throw if UpdateAccessTokenRepository throws.', async () => {
		const { sut, updateAccessTokenRepositoryStub } = makeSut();
		jest.spyOn(updateAccessTokenRepositoryStub, 'updateAccessToken')
			.mockReturnValueOnce(new Promise((resolve, reject) => reject(new Error())));
		const promise = sut.auth(makeFakeAuthentication());
		await expect(promise).rejects.toThrow();
	});
});
