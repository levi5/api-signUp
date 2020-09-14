import { SignUpController } from './SignUp';
import { HttpRequest, EmailValidator } from '../protocols';
import { InvalidParamError, MissingParamError, ServerError } from '../errors';
import { IAddAccount, IAddAccountModel } from '../../domain/useCases/add-account';
import { IAccountModel } from '../../domain/model/account';

interface SutTypes {
	sut:SignUpController,
	emailValidatorStub: EmailValidator,
	addAccountStub: IAddAccount,
}

const makeEmailValidator = ():EmailValidator => {
	class EmailValidatorStub implements EmailValidator {
		isValid (email:string) {
			return true;
		}
	}
	return new EmailValidatorStub();
};

const makeAddAccount = ():IAddAccount => {
	class AddAccountStub implements IAddAccount {
		add (account:IAddAccountModel): IAccountModel {
			const fakeAccount = {
				id: 'id_valid',
				name: 'valid_name',
				email: 'valid_email'
			};
			return fakeAccount;
		}
	}
	return new AddAccountStub();
};

const makeSut = ():SutTypes => {
	// injecting an email validator into the signUpController

	const emailValidatorStub = makeEmailValidator();
	const addAccountStub = makeAddAccount();
	const sut = new SignUpController(emailValidatorStub, addAccountStub);
	return {
		sut,
		emailValidatorStub,
		addAccountStub
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

	test('return error 400 if the password confirmation fails', () => {
		const { sut } = makeSut();
		const httpRequest:HttpRequest = {
			body: {
				name: 'any_name',
				email: 'any@email.com',
				password: 'any_password',
				passwordConfirmation: 'invalid_password'
			}

		};

		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(400);
		expect(httpResponse.body).toEqual(new InvalidParamError('passwordConfirmation'));
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

	test('return error 500 if  EmailValidator throws', () => {
		const { sut, emailValidatorStub } = makeSut();
		jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
			throw new Error();
		});

		const httpRequest:HttpRequest = {
			body: {
				name: 'any_name',
				email: 'invalid@email.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		};

		const httpResponse = sut.handle(httpRequest);
		expect(httpResponse.statusCode).toBe(500);
		expect(httpResponse.body).toEqual(new ServerError());
	});

	test('Should call AddAccount with correct values', () => {
		const { sut, addAccountStub } = makeSut();
		const addSpy = jest.spyOn(addAccountStub, 'add');
		const httpRequest:HttpRequest = {
			body: {
				name: 'any_name',
				email: 'invalid@email.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		};

		sut.handle(httpRequest);
		expect(addSpy).toHaveBeenCalledWith({
			name: 'any_name',
			email: 'invalid@email.com',
			password: 'any_password'
		});
	});
});
