import { DbAddAccount } from '../../../data/usecases/add-account/db-add-account';
import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication';
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter';
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository';
import { SignUpController } from '../../../presentation/controllers/signUp/Signup-controller';
import { IController } from '../../../presentation/protocols/controller';
import env from '../../config/env';

import { LoggerControllerDecorator } from '../../decorator/log-controller-decorator';
import { makeSignUpValidation } from './signup-validation-factory';

export const makeSignUpController = ():IController => {
	const salt = 12;
	const bcrypterAdapter = new BcryptAdapter(salt);
	const jwtAdapter = new JwtAdapter(env.jwtSecret);
	const accountMongoRepository = new AccountMongoRepository();
	const dbAddAccount = new DbAddAccount(bcrypterAdapter, accountMongoRepository);

	const dbAuthentication = new DbAuthentication(bcrypterAdapter, accountMongoRepository, jwtAdapter, accountMongoRepository);

	const signUpController = new SignUpController(dbAddAccount, dbAuthentication, makeSignUpValidation());
	const logMongoRepository = new LogMongoRepository();
	return new LoggerControllerDecorator(signUpController, logMongoRepository);
};
