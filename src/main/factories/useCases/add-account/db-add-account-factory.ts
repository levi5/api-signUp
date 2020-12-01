import { DbAddAccount } from '../../../../data/usecases/add-account/db-add-account';
import { LoadAccountByEmailRepository } from '../../../../data/usecases/add-account/load-account-by-email';
import { BcryptAdapter } from '../../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../../infra/db/mongodb/account/account-mongo-repository';
export const makeDbAddAccount = ():DbAddAccount => {
	const salt = 12;
	const bcrypterAdapter = new BcryptAdapter(salt);
	const accountMongoRepository = new AccountMongoRepository();
	const loadAccountByEmailRepository = new LoadAccountByEmailRepository();
	return new DbAddAccount(bcrypterAdapter, accountMongoRepository, loadAccountByEmailRepository);
};
