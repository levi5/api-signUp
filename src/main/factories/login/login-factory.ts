import env from '../../config/env';

import { LoggerControllerDecorator } from '../../decorator/log-controller-decorator';
import { makeLoginValidation } from './login-validation-factory';
import { IController } from '../../../presentation/protocols';

import { DbAuthentication } from '../../../data/usecases/authentication/db-authentication';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository';
import { LoginController } from '../../../presentation/controllers/login/login-controller';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/account-mongo-repository';
import { BcryptAdapter } from '../../../infra/cryptography/bcrypt-adapter/bcrypt-adapter';
import { JwtAdapter } from '../../../infra/cryptography/jwt-adapter/jwt-adapter';

export const makeSignUpController = ():IController => {
	const salt = 12;
	const bcryptAdapter = new BcryptAdapter(salt);
	const jwtAdapter = new JwtAdapter(env.jwtSecret);
	const accountMongoRepository = new AccountMongoRepository();
	const dbAuthentication = new DbAuthentication(bcryptAdapter, accountMongoRepository, jwtAdapter, accountMongoRepository);
	const loginController = new LoginController(dbAuthentication, makeLoginValidation());
	const logMongoRepository = new LogMongoRepository();

	return new LoggerControllerDecorator(loginController, logMongoRepository);
};
