import { IValidation } from '../../../presentation/controllers/signUp/signUp-protocols';
import { EmailValidation, RequiredFieldValidation, ValidationComposite } from '../../../presentation/helpers/validators';
import { EmailValidatorAdapter } from '../../../utils/email-validator-adapter';

export const makeLoginValidation = ():ValidationComposite => {
	const validations:IValidation[] = [];
	for (const field of ['email', 'password']) {
		validations.push(new RequiredFieldValidation(field));
	}
	validations.push(new EmailValidation('email', new EmailValidatorAdapter()));
	return new ValidationComposite(validations);
};
