import { SignUpController } from './SignUp';
import { IAddAccount, IAddAccountModel, IAccountModel, IEmailValidator, IHttpRequest } from './signUp-protocols';
import { InvalidParamError, MissingParamError, ServerError } from '../../errors';
import { badRequest, serverError, success } from '../../helpers/http-helper';

interface SutTypes {
	sut:SignUpController,
	emailValidatorStub: IEmailValidator,
	addAccountStub: IAddAccount,
}

const makeEmailValidator = ():IEmailValidator => {
	class EmailValidatorStub implements IEmailValidator {
		isValid (email:string) {
			return true;
		}
	}
	return new EmailValidatorStub();
};

const makeAddAccount = ():IAddAccount => {
	class AddAccountStub implements IAddAccount {
		async add (account:IAddAccountModel): Promise<IAccountModel> {
			return new Promise(resolve => resolve(makeFakeAccount()));
		}
	}
	return new AddAccountStub();
};

const makeFakeAccount = ():IAccountModel => (
	{
		id: 'valid_id',
		name: 'valid_name',
		email: 'valid_@email.com'
	}
);

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

const makeFakeRequest = ():IHttpRequest => ({
	body: {
		name: 'any_name',
		email: 'any_@email.com',
		password: 'any_password',
		passwordConfirmation: 'any_password'
	}
});

describe('SignUp Controller', () => {
	test('Should return error 400 if the name is not provided', async () => {
		const { sut } = makeSut();
		const httpRequest:IHttpRequest = {
			body: {
				email: 'any@email.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		};

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(badRequest(new MissingParamError('name')));
	});

	test('Should return error 400 if the email is not provided', async () => {
		const { sut } = makeSut();
		const httpRequest:IHttpRequest = {
			body: {
				name: 'any_name',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}

		};

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(badRequest(new MissingParamError('email')));
	});

	test('Should return error 400 if the password is not provided', async () => {
		const { sut } = makeSut();
		const httpRequest:IHttpRequest = {
			body: {
				name: 'any_name',
				email: 'any@email.com',
				passwordConfirmation: 'any_password'
			}

		};

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(badRequest(new MissingParamError('password')));
	});

	test('Should return error 400 if the password confirmation is not provided', async () => {
		const { sut } = makeSut();
		const httpRequest:IHttpRequest = {
			body: {
				name: 'any_name',
				email: 'any@email.com',
				password: 'any_password'
			}

		};

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(badRequest(new MissingParamError('passwordConfirmation')));
	});

	test('Should return error 400 if the password confirmation fails', async () => {
		const { sut } = makeSut();
		const httpRequest:IHttpRequest = {
			body: {
				name: 'any_name',
				email: 'any@email.com',
				password: 'any_password',
				passwordConfirmation: 'invalid_password'
			}

		};

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual(badRequest(new InvalidParamError('passwordConfirmation')));
	});

	test('Should return error 400 if an invalid email is provided', async () => {
		const { sut, emailValidatorStub } = makeSut();
		jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(badRequest(new InvalidParamError('email')));
	});

	test('Should call EmailValidator with correct email', async () => {
		const { sut, emailValidatorStub } = makeSut();
		const isValid = jest.spyOn(emailValidatorStub, 'isValid');

		sut.handle(makeFakeRequest());
		expect(isValid).toBeCalledWith('any_@email.com');
	});

	test('Should return error 500 if  EmailValidator throws', async () => {
		const { sut, emailValidatorStub } = makeSut();
		jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
			throw new Error();
		});

		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(serverError(new ServerError(null)));
	});

	test('Should call AddAccount with correct values', () => {
		const { sut, addAccountStub } = makeSut();
		const addSpy = jest.spyOn(addAccountStub, 'add');

		sut.handle(makeFakeRequest());
		expect(addSpy).toHaveBeenCalledWith({
			name: 'any_name',
			email: 'any_@email.com',
			password: 'any_password'
		});
	});

	test('Should return error 500 if  AddAccount throws', async () => {
		const { sut, addAccountStub } = makeSut();
		jest.spyOn(addAccountStub, 'add').mockImplementation(async () => {
			return new Promise((resolve, reject) => reject(new Error()));
		});

		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(serverError(new ServerError(null)));
	});

	test('Should return 200 if valid data provided', async () => {
		const { sut } = makeSut();
		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(success(makeFakeAccount()));
	});
});
