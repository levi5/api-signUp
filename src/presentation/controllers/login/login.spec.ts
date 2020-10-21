import { InvalidParamError, MissingParamError } from '../../errors';
import { badRequest, serverError } from '../../helpers/http-helper';
import { IEmailValidator, IHttpRequest } from '../signUp/signUp-protocols';
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

const makeFakeRequest = ():IHttpRequest => ({
	body: {
		email: 'any_email@email.com',
		password: 'any_password'
	}
});

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

	test('Should return 400 if an invalid email is provided', async () => {
		const { sut, emailValidatorStub } = makeSut();
		jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
	});

	test('Should call EmailValidator with correct email', async () => {
		const { sut, emailValidatorStub } = makeSut();

		const isValidSpy = jest.spyOn(emailValidatorStub, 'isValid');

		await sut.handle(makeFakeRequest());
		expect(isValidSpy).toHaveBeenCalledWith('any_email@email.com');
	});

	test('Should return 500 if EmailValidator throws', async () => {
		const { sut, emailValidatorStub } = makeSut();
		jest.spyOn(emailValidatorStub, 'isValid').mockImplementationOnce(() => {
			throw new Error();
		});
		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(serverError(new Error()));
	});
});
