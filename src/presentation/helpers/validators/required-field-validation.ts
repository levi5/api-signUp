import { MissingParamError } from '../../errors';
import { IValidation } from '../../protocols/validation';

export class RequiredFieldValidation implements IValidation {
	constructor (private readonly fieldName :string) {
		this.fieldName = fieldName;
	}

	validate (input: any): Error {
		if (!input[this.fieldName]) {
			return new MissingParamError(this.fieldName);
		}
	}
}
