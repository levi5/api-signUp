import { IAccountModel, IAddAccount, IAddAccountModel, IAddAccountRepository, IEncrypter } from './db-add-account-protocols';

export class DbAddAccount implements IAddAccount {
private readonly encrypter: IEncrypter;
private readonly addAccountRepository:IAddAccountRepository

constructor (encrypter: IEncrypter, addAccountRepository:IAddAccountRepository) {
	this.encrypter = encrypter;
	this.addAccountRepository = addAccountRepository;
}

async add (account: IAddAccountModel):Promise<IAccountModel> {
	const hashPassword = await this.encrypter.encrypt(account.password);
	await this.addAccountRepository.add({ ...account, password: hashPassword });
	return new Promise(resolve => resolve(null));
}
}
