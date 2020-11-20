import validator from 'validator';

import { IEmailValidator } from '../../../presentation/protocols/email-validator';

export class EmailValidatorAdapter implements IEmailValidator {
	isValid (email: string): boolean | Error {
		return validator.isEmail(email);
	}
}
