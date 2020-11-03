import { LoadAccountByEmailRepository } from '../../protocols/db/load-account-by-email-repository';
import { IAuthentication, IAuthenticationModel } from '../../../domain/useCases/authentication';
import { IHashComparer } from '../../protocols/cryptography/hash-comparer';

export class DbAuthentication implements IAuthentication {
private readonly loadAccountByEmailRepository:LoadAccountByEmailRepository;
private readonly hashComparer:IHashComparer;

constructor (hashComparer:IHashComparer, loadAccountByEmailRepository:LoadAccountByEmailRepository) {
	this.hashComparer = hashComparer;
	this.loadAccountByEmailRepository = loadAccountByEmailRepository;
}

async auth (authentication: IAuthenticationModel): Promise<string> {
	const account = await this.loadAccountByEmailRepository.load(authentication.email);
	if (account) {
		await this.hashComparer.compare(authentication.password, account.password);
	}

	return null;
}
}
