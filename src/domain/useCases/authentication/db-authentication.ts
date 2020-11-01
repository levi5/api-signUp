import { LoadAccountByEmailRepository } from '../../../data/protocols/load-account-by-email-repository';
import { IAuthentication, IAuthenticationModel } from '../authentication';

export class DbAuthentication implements IAuthentication {
private readonly loadAccountByEmailRepository:LoadAccountByEmailRepository
constructor (loadAccountByEmailRepository:LoadAccountByEmailRepository) {
	this.loadAccountByEmailRepository = loadAccountByEmailRepository;
}

async auth (authentication: IAuthenticationModel): Promise<string> {
	await this.loadAccountByEmailRepository.load(authentication.email);

	return null;
}
}
