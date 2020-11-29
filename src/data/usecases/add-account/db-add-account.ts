import { IAccountModel, IAddAccount, IAddAccountModel, IAddAccountRepository, IHasher, LoadAccountByEmailRepository } from './db-add-account-protocols';

export class DbAddAccount implements IAddAccount {
	constructor (
	private readonly hasher: IHasher,
	private readonly addAccountRepository:IAddAccountRepository,
	private readonly loadAccountByEmailRepository:LoadAccountByEmailRepository) {
		this.hasher = hasher;
		this.addAccountRepository = addAccountRepository;
		this.loadAccountByEmailRepository = loadAccountByEmailRepository;
	}

	async add (account: IAddAccountModel):Promise<IAccountModel> {
		await this.loadAccountByEmailRepository.loadByEmail(account.email);
		const hashPassword = await this.hasher.hash(account.password);
		const accountResponse = await this.addAccountRepository.add({ ...account, password: hashPassword });
		return accountResponse;
	}
}
