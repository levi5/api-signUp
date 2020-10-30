import { badRequest, serverError, success, unauthorized } from '../../helpers/http/http-helper';
import { IController, IHttpRequest, IHttpResponse, IAuthentication, IValidation } from './login-protocols';

export class LoginController implements IController {
private readonly validation:IValidation;
private readonly authentication:IAuthentication;
constructor (authentication:IAuthentication, validation:IValidation) {
	this.authentication = authentication;
	this.validation = validation;
}

async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
	try {
		const error = this.validation.validate(httpRequest.body);
		if (error) {
			return badRequest(error);
		}
		const { email, password } = httpRequest.body;
		const token = await this.authentication.auth({ email, password });
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
