import { IAddAccountRepository } from '../../../../data/protocols/db/account/add-account-repository';
import { ILoadAccountByEmailRepository } from '../../../../data/protocols/db/account/load-account-by-email-repository';
import { IUpdateAccessTokenRepository } from '../../../../data/usecases/authentication/db-authentication-protocols';
import { IAccountModel } from '../../../../domain/model/account';
import { IAddAccountModel } from '../../../../domain/useCases/add-account';
import { MongoHelper } from '../helpers/mongo-helper';

export class AccountMongoRepository implements IAddAccountRepository, ILoadAccountByEmailRepository, IUpdateAccessTokenRepository {
	async add (accountData:IAddAccountModel): Promise<IAccountModel> {
		const accountCollection = await MongoHelper.getCollection('accounts');
		const result = await accountCollection.insertOne(accountData);
		return MongoHelper.map(result.ops[0]);
	}

	async loadByEmail (email: string): Promise<IAccountModel> {
		const accountCollection = await MongoHelper.getCollection('accounts');
		const account = await accountCollection.findOne({ email });
		return account && MongoHelper.map(account);
	}

	async updateAccessToken (id: string, token: string): Promise<void> {
		const accountCollection = await MongoHelper.getCollection('accounts');
		await accountCollection.updateOne({ _id: id }, {
			$set: {
				accessToken: token

			}
		});
	}
}
