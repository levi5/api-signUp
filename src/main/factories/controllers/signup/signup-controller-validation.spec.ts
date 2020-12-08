import { CompareFieldsValidation, EmailValidation, ValidationComposite, RequiredFieldValidation }
	from '../../../../validation/validators';
import { IValidation } from '../../../../presentation/protocols/validation';
import { IEmailValidator } from '../../../../validation/protocols/email-validator';
import { makeSignUpValidation } from './signup-validation-factory';

jest.mock('../../../../validation/validators/validation-composite');

const makeEmailValidator = ():IEmailValidator => {
	class EmailValidatorStub implements IEmailValidator {
		isValid (email:string) {
			return true;
		}
	}
	return new EmailValidatorStub();
};

describe('SignUpValidator Factory', () => {
	test('Should calls ValidationComposite with all validations', () => {
		makeSignUpValidation();
		const validations:IValidation[] = [];
		for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
			validations.push(new RequiredFieldValidation(field));
		}
		validations.push(new CompareFieldsValidation('password', 'passwordConfirmation'));
		validations.push(new EmailValidation('email', makeEmailValidator()));
		expect(ValidationComposite).toHaveBeenCalledWith(validations);
	});
});
