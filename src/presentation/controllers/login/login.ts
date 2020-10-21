import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/http-helper';
import { IController, IHttpRequest, IHttpResponse } from '../../protocols';
import { IEmailValidator } from '../signUp/signUp-protocols';

export class LoginController implements IController {
private readonly emailValidator:IEmailValidator;
constructor (emailValidator:IEmailValidator) {
	this.emailValidator = emailValidator;
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
	} catch (error) {
		return serverError(error);
	}
}
}
