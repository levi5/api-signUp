import { makeLoginValidation } from './login-validation-factory';
import { IController } from '../../../../presentation/protocols';

import { LoginController } from '../../../../presentation/controllers/login/login-controller';
import { makeDbAuthentication } from '../../useCases/authentication/db-authentication-factory';
import { makeLogControllerDecorator } from '../../decorator/log-controller-decorator-factory';

export const makeLoginController = ():IController => {
	const loginController = new LoginController(makeDbAuthentication(), makeLoginValidation());
	return makeLogControllerDecorator(loginController);
};
