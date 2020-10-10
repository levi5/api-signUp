import { IHttpRequest, IHttpResponse, IController, IAddAccount, IEmailValidator } from './signUp-protocols';
import { MissingParamError, InvalidParamError } from '../../errors';
import { badRequest, serverError, success } from '../../helpers/http-helper';

export class SignUpController implements IController {
	private readonly emailValidator:IEmailValidator;
	private readonly addAccount:IAddAccount;

	constructor (emailValidator:IEmailValidator, addAccount:IAddAccount) {
		this.emailValidator = emailValidator;
		this.addAccount = addAccount;
	}

	async handle (httpRequest:IHttpRequest):Promise<IHttpResponse> {
		try {
			const requiredFields = ['name', 'email', 'password', 'passwordConfirmation'];
			for (const field of requiredFields) {
				if (!httpRequest.body[field]) {
					return badRequest(new MissingParamError(field));
				}
			};

			const { name, email, password, passwordConfirmation } = httpRequest.body;

			if (password !== passwordConfirmation) {
				return badRequest(new InvalidParamError('passwordConfirmation'));
			}

			const isValid = this.emailValidator.isValid(email);

			if (!isValid) {
				return badRequest(new InvalidParamError('email'));
			}

			const account = await this.addAccount.add({
				name,
				email,
				password
			});
			return success(account);
		} catch (error) {
			return serverError();
		}
	}
}
