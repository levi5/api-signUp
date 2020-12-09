import { IValidation } from '../../../../presentation/controllers/login/signUp/signup-controller-protocols';
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../../validation/validators';
import { EmailValidatorAdapter } from '../../../../infra/validators/email-validator-adapter';

export const makeLoginValidation = ():ValidationComposite => {
	const validations:IValidation[] = [];
	for (const field of ['email', 'password']) {
		validations.push(new RequiredFieldValidation(field));
	}
	validations.push(new EmailValidation('email', new EmailValidatorAdapter()));
	return new ValidationComposite(validations);
};
