import { IAccountModel } from '../../../domain/model/account';
import { IAddAccount, IAddAccountModel } from '../../../domain/useCases/add-account';
import { IEncrypter } from '../../protocols/encrypter';

export class DbAddAccount implements IAddAccount {
private encrypter: IEncrypter;
constructor (encrypter: IEncrypter) {
	this.encrypter = encrypter;
}

async add (account: IAddAccountModel):Promise<IAccountModel> {
	await this.encrypter.encrypt(account.password);
	return new Promise(resolve => resolve(null));
}
}
