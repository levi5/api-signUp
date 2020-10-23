import { IHttpRequest, IHttpResponse, IController, IAddAccount, IEmailValidator } from './signUp-protocols';
import { InvalidParamError } from '../../errors';
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
			const error = this.validation.validate(httpRequest.body);
			if (error) {
				return badRequest(error);
			}

			const { name, email, password } = httpRequest.body;

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
