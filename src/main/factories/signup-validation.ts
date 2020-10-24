import { IValidation } from '../../presentation/controllers/signUp/signUp-protocols';
import { RequiredFieldValidation } from '../../presentation/helpers/validators/required-field-validation';
import { ValidationComposite } from '../../presentation/helpers/validators/validation-composite';

export const makeSignUpValidation = ():ValidationComposite => {
	const validations:IValidation[] = [];
	for (const field of ['name', 'email', 'password', 'passwordConfirmation']) {
		validations.push(new RequiredFieldValidation(field));
	}
	return new ValidationComposite(validations);
};
