import { DbAddAccount } from '../../data/usecases/add-account/db-add-account';
import { BcryptAdapter } from '../../infra/criptography/bcrypt-adapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/account-repository/account';
import { SignUpController } from '../../presentation/controllers/signUp/SignUp';
import { IController } from '../../presentation/protocols/controller';
import { EmailValidatorAdapter } from '../../utils/email-validator-adapter';
import { LoggerControllerDecorator } from '../decorator/log';

export const makeSignUpController = ():IController => {
	const emailValidatorAdapter = new EmailValidatorAdapter();
	const salt = 12;
	const bcrypterAdapter = new BcryptAdapter(salt);
	const accountMongoRepository = new AccountMongoRepository();
	const dbAddAccount = new DbAddAccount(bcrypterAdapter, accountMongoRepository);

	const signUpController = new SignUpController(emailValidatorAdapter, dbAddAccount);
	return new LoggerControllerDecorator(signUpController);
};
