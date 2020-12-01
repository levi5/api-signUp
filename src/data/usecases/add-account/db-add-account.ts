import {
	IAccountModel, IAddAccount,
	IAddAccountModel, IAddAccountRepository,
	IHasher, ILoadAccountByEmailRepository
} from './db-add-account-protocols';

export class DbAddAccount implements IAddAccount {
	constructor (
	private readonly hasher: IHasher,
	private readonly addAccountRepository:IAddAccountRepository,
	private readonly loadAccountByEmailRepository:ILoadAccountByEmailRepository) {
		this.hasher = hasher;
		this.addAccountRepository = addAccountRepository;
		this.loadAccountByEmailRepository = loadAccountByEmailRepository;
	}

	async add (accountData: IAddAccountModel):Promise<IAccountModel> {
		const account = await this.loadAccountByEmailRepository.loadByEmail(accountData.email);
		if (!account) {
			const hashPassword = await this.hasher.hash(accountData.password);
			const newAccount = await this.addAccountRepository.add({ ...accountData, password: hashPassword });
			return newAccount;
		}
		return null;
	}
}
