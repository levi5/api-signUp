import {
	IAuthentication,
	IAuthenticationModel,
	IHashComparer, LoadAccountByEmailRepository,
	IEncrypter, IUpdateAccessTokenRepository
} from './db-authentication-protocols';

export class DbAuthentication implements IAuthentication {
private readonly loadAccountByEmailRepository:LoadAccountByEmailRepository;
private readonly hashComparer:IHashComparer;
private readonly encrypter:IEncrypter;
private readonly updateAccessTokenRepository:IUpdateAccessTokenRepository;

constructor (hashComparer:IHashComparer,
	loadAccountByEmailRepository:LoadAccountByEmailRepository,
	encrypter:IEncrypter,
	updateAccessTokenRepository:IUpdateAccessTokenRepository) {
	this.hashComparer = hashComparer;
	this.loadAccountByEmailRepository = loadAccountByEmailRepository;
	this.encrypter = encrypter;
	this.updateAccessTokenRepository = updateAccessTokenRepository;
}

async auth (authentication: IAuthenticationModel): Promise<string> {
	const account = await this.loadAccountByEmailRepository.loadByEmail(authentication.email);
	if (account) {
		const isValid = await this.hashComparer.compare(authentication.password, account.password);

		if (isValid) {
			const accessToken = await this.encrypter.encrypt(account.id);
			await this.updateAccessTokenRepository.updateAccessToken(account.id, accessToken);
			return accessToken;
		}
	}

	return null;
}
}
