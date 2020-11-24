import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository';
import { SignUpController } from '../../../presentation/controllers/signUp/Signup-controller';
import { IController } from '../../../presentation/protocols/controller';

import { LoggerControllerDecorator } from '../../decorator/log-controller-decorator';
import { makeSignUpValidation } from './signup-validation-factory';

export const makeSignUpController = ():IController => {
	const salt = 12;
	const bcrypterAdapter = new BcryptAdapter(salt);
	const accountMongoRepository = new AccountMongoRepository();
	const dbAddAccount = new DbAddAccount(bcrypterAdapter, accountMongoRepository);

	const signUpController = new SignUpController(dbAddAccount, makeSignUpValidation());
	const logMongoRepository = new LogMongoRepository();
	return new LoggerControllerDecorator(signUpController, logMongoRepository);
};