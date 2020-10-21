import { IHttpRequest, IHttpResponse, IController, IAddAccount, IEmailValidator } from './signUp-protocols';
import { MissingParamError, InvalidParamError } from '../../errors';
import { badRequest, serverError, success } from '../../helpers/http-helper';
import { IValidation } from '../../helpers/validators/validation';

export class SignUpController implements IController {
	private readonly addAccount:IAddAccount;
	private readonly validation:IValidation;
	private readonly emailValidator:IEmailValidator;

	constructor (addAccount:IAddAccount, validation:IValidation, emailValidator:IEmailValidator) {
		this.addAccount = addAccount;
		this.validation = validation;
		this.emailValidator = emailValidator;
	}

	async handle (httpRequest:IHttpRequest):Promise<IHttpResponse> {
		try {
			this.validation.validate(httpRequest.body);
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
			return serverError(error);
		}
	}
}
