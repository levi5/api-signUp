
import { IAddAccountRepository } from '../../../../data/protocols/add-account-repository';
import { IAccountModel } from '../../../../domain/model/account';
import { IAddAccountModel } from '../../../../domain/useCases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements IAddAccountRepository {
	async add (accountData:IAddAccountModel): Promise<IAccountModel> {
		const accountCollection = MongoHelper.getCollection('accounts');
		const result = await accountCollection.insertOne(accountData);
		const account = result.ops[0];
		const { _id, ...accountWithoutId } = account;

		return Object.assign({}, accountWithoutId, { id: _id });
	}
}