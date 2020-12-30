import { IValidation } from '../../../protocols';
import { AddSurveyController } from './add-survey-controller';
import { IHttpRequest } from './add-survey-controller-protocols';

const makeFakeRequest = ():IHttpRequest => ({
	body: {
		question: 'any_question',
		answers: [{
			image: 'any_image',
			answer: 'any_answer'
		}]
	}
});

describe('AddSurvey controller', () => {
	test('Should call validation with correct values', async () => {
		class ValidationStub implements IValidation {
			validate (input: any): Error {
				return null;
			}
		}
		const validationStub = new ValidationStub();
		const sut = new AddSurveyController(validationStub);
		const validateSpy = jest.spyOn(validationStub, 'validate');
		const httpRequest = makeFakeRequest();
		await sut.handle(httpRequest);
		expect(validateSpy).toHaveBeenCalledWith(httpRequest.body);
	});
});
