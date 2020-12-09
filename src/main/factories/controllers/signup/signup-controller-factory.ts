import { SignUpController } from '../../../../presentation/controllers/login/signUp/signup-controller';
import { IController } from '../../../../presentation/protocols/controller';

import { makeLogControllerDecorator } from '../../decorator/log-controller-decorator-factory';
import { makeDbAddAccount } from '../../useCases/add-account/db-add-account-factory';
import { makeDbAuthentication } from '../../useCases/authentication/db-authentication-factory';
import { makeSignUpValidation } from './signup-validation-factory';

export const makeSignUpController = ():IController => {
	const signUpController = new SignUpController(makeDbAddAccount(), makeDbAuthentication(), makeSignUpValidation());
	return makeLogControllerDecorator(signUpController);
};
