import { IAuthentication } from '../../../domain/useCases/authentication';
import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/http-helper';
import { IController, IHttpRequest, IHttpResponse } from '../../protocols';
import { IEmailValidator } from '../signUp/signUp-protocols';

export class LoginController implements IController {
private readonly emailValidator:IEmailValidator;
private readonly authentication:IAuthentication;
constructor (emailValidator:IEmailValidator, authentication:IAuthentication) {
	this.emailValidator = emailValidator;
	this.authentication = authentication;
}

async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
	try {
		const { email, password } = httpRequest.body;

		if (!email) {
			return new Promise(resolve => resolve(badRequest(new MissingParamError('email'))));
		}

		if (!password) {
			return new Promise(resolve => resolve(badRequest(new MissingParamError('password'))));
		}

		const isValid = await this.emailValidator.isValid(email);
		if (!isValid) {
			return new Promise(resolve => resolve(badRequest(new InvalidParamError('email'))));
		}
		await this.authentication.auth(email, password);
	} catch (error) {
		return serverError(error);
	}
}
}
