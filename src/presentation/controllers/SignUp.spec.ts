import { SignUpController } from './SignUp';
import { HttpRequest } from '../protocols/http';
import { MissingParamError } from '../errors/missing-param-error';
import { InvalidParamError } from '../errors/invalid-param-error';
import { EmailValidator } from '../protocols/email-validator';

interface SutTypes {
	sut:SignUpController,
	emailValidatorStub: EmailValidator,
}

const makeSut = ():SutTypes => {
	// injecting an email validator into the signUpController

	class EmailValidatorStub implements EmailValidator {
		isValid (email:string) {
			return true;
		}
	}
	const emailValidatorStub = new EmailValidatorStub();
	const sut = new SignUpController(emailValidatorStub);
	return {
		sut,
		emailValidatorStub
	};
};

describe('SignUp Controller', () => {
	test('return error 400 if the name is not provided', () => {
		const { sut } = makeSut();
		const httpRequest:HttpRequest = {
			body: {
				email: 'any@email.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		};

		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError('name'));
	});

	test('return error 400 if the email is not provided', () => {
		const { sut } = makeSut();
		const httpRequest:HttpRequest = {
			body: {
				name: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}

		};

		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError('email'));
	});

	test('return error 400 if the password is not provided', () => {
		const { sut } = makeSut();
		const httpRequest:HttpRequest = {
			body: {
				name: 'any_name',
				email: 'any@email.com',
				passwordConfirmation: 'any_password'
			}

		};

		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError('password'));
	});

	test('return error 400 if the password confirmation is not provided', () => {
		const { sut } = makeSut();
		const httpRequest:HttpRequest = {
			body: {
				name: 'any_name',
				email: 'any@email.com',
				password: 'any_password'
			}

		};

		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new MissingParamError('passwordConfirmation'));
	});

	test('return error 400 if an invalid email is provided', () => {
		const { sut, emailValidatorStub } = makeSut();
		jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

		const httpRequest:HttpRequest = {
			body: {
				name: 'any_name',
				email: 'invalid@email.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}

		};

		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new InvalidParamError('email'));
	});

	test('Should call EmailValidator with correct email', () => {
		const { sut, emailValidatorStub } = makeSut();
		const isValid = jest.spyOn(emailValidatorStub, 'isValid');

		const httpRequest:HttpRequest = {
			body: {
				name: 'any_name',
				email: 'any_@email.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		};

		sut.handle(httpRequest);
		expect(isValid).toBeCalledWith('any_@email.com');
	});
});
