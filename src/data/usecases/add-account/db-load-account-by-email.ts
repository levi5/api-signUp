import { IAccountModel } from '../../../domain/model/account';
import { MongoHelper } from '../../../infra/db/mongodb/helpers/mongo-helper';
import { ILoadAccountByEmailRepository } from './db-add-account-protocols';

export class LoadAccountByEmailRepository implements ILoadAccountByEmailRepository {
	async loadByEmail (email: string): Promise<IAccountModel> {
		const accountCollection = await MongoHelper.getCollection('accounts');
		const account = await accountCollection.findOne({ email });
		return account && MongoHelper.map(account);
	}
}
