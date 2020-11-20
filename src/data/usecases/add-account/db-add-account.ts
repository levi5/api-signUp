import { IAccountModel, IAddAccount, IAddAccountModel, IAddAccountRepository, IHasher } from './db-add-account-protocols';

export class DbAddAccount implements IAddAccount {
	constructor (
	private readonly hasher: IHasher,
	private readonly addAccountRepository:IAddAccountRepository) {
		this.hasher = hasher;
		this.addAccountRepository = addAccountRepository;
	}

	async add (account: IAddAccountModel):Promise<IAccountModel> {
		const hashPassword = await this.hasher.hash(account.password);
		const accountResponse = await this.addAccountRepository.add({ ...account, password: hashPassword });
		return accountResponse;
	}
}
