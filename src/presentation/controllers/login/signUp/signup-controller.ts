import { IHttpRequest, IHttpResponse, IController, IAddAccount, IAuthentication } from './signup-controller-protocols';
import { badRequest, forbidden, serverError, success } from '../../../helpers/http/http-helper';
import { IValidation } from '../../../protocols/validation';
import { EmailInUseError } from '../../../errors';

export class SignUpController implements IController {
	constructor (
		private readonly addAccount:IAddAccount,
		private readonly authentication:IAuthentication,
		private readonly validation:IValidation) {
		this.addAccount = addAccount;
		this.authentication = authentication;
		this.validation = validation;
	}

	async handle (httpRequest:IHttpRequest):Promise<IHttpResponse> {
		try {
			const error = this.validation.validate(httpRequest.body);
			if (error) {
				return badRequest(error);
			}

			const { name, email, password } = httpRequest.body;

			const account = await this.addAccount.add({
				name,
				email,
				password
			});
			if (!account) {
				return forbidden(new EmailInUseError());
			}

			const accessToken = await this.authentication.auth({ email, password });

			return success({ accessToken });
		} catch (error) {
			return serverError(error);
		}
	}
}
