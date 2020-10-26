import { EmailValidation } from './email-validation';
import { IEmailValidator } from '../../protocols/email-validator';
import { InvalidParamError } from '../../errors';

interface SutTypes {
	sut:EmailValidation,
	emailValidatorStub: IEmailValidator,
}

const makeEmailValidator = ():IEmailValidator => {
	class EmailValidatorStub implements IEmailValidator {
		isValid (email:string) {
			return true;
		}
	}
	return new EmailValidatorStub();
};

const makeSut = ():SutTypes => {
	const emailValidatorStub = makeEmailValidator();

	const sut = new EmailValidation('email', emailValidatorStub);
	return {
		sut,
		emailValidatorStub
	};
};

describe('SignUp Controller', () => {
	test('Should return an error if EmailValidator  returns false', () => {
		const { sut, emailValidatorStub } = makeSut();
		jest.spyOn(emailValidatorStub, 'isValid').mockReturnValueOnce(false);

		const error = sut.validate({ email: 'any_@email.com' });
		expect(error).toEqual(new InvalidParamError('email'));
	});

	test('Should call EmailValidator with correct email', () => {
		const { sut, emailValidatorStub } = makeSut();
		const isValid = jest.spyOn(emailValidatorStub, 'isValid');

		sut.validate({ email: 'any_@email.com' });
		expect(isValid).toBeCalledWith('any_@email.com');
	});

	test('Should throw if  EmailValidator throws', () => {
		const { sut, emailValidatorStub } = makeSut();
		jest.spyOn(emailValidatorStub, 'isValid').mockImplementation(() => {
			throw new Error();
		});
		expect(sut.validate).toThrow();
	});
});
