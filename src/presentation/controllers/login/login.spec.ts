import { MissingParamError } from '../../errors';
import { badRequest } from '../../helpers/http-helper';
import { IEmailValidator } from '../signUp/signUp-protocols';
import { LoginController } from './login';

interface SutTypes {
    sut: LoginController
    emailValidatorStub:IEmailValidator
}

const makeEmailValidator = (): IEmailValidator => {
	class EmailValidatorStub implements IEmailValidator {
		isValid (email: string): boolean | Error {
			return true;
		}
	}

	return new EmailValidatorStub();
};

const makeSut = ():SutTypes => {
	const emailValidatorStub = makeEmailValidator();
	const sut = new LoginController(emailValidatorStub);

	return {
		sut,
		emailValidatorStub
	};
};

describe('Login Controller', () => {
	test('Should return 400 if no email is provided', async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				password: 'any_password'
			}
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
	});

	test('Should return 400 if no password is provided', async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				email: 'any_email@email.com'
			}
		};
		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
	});

	test('Should call EmailValidator with correct email', async () => {
		const { sut, emailValidatorStub } = makeSut();

		const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');
		const httpRequest = {
			body: {
				email: 'any_email@email.com',
				password: 'any_password'
			}
		};
		await sut.handle(httpRequest);
		expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com');
	});
});
