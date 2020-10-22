import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError, success, unauthorized } from '../../helpers/http-helper';
import { IController, IHttpRequest, IHttpResponse, IEmailValidator, IAuthentication } from './login-protocols';

export class LoginController implements IController {
private readonly emailValidator:IEmailValidator;
private readonly authentication:IAuthentication;
constructor (emailValidator:IEmailValidator, authentication:IAuthentication) {
	this.emailValidator = emailValidator;
	this.authentication = authentication;
}

async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
	try {
		const requiredFields = ['email', 'password'];
		for (const field of requiredFields) {
			if (!httpRequest.body[field]) {
				return badRequest(new MissingParamError(field));
			}
		};

		const { email, password } = httpRequest.body;
		const isValid = await this.emailValidator.isValid(email);
		if (!isValid) {
			return badRequest(new InvalidParamError('email'));
		}
		const token = await this.authentication.auth(email, password);
		if (!token) {
			return unauthorized();
		}

		return success({
			accessToken: token
		});
	} catch (error) {
		return serverError(error);
	}
}
}
