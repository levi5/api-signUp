
import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols';
import { LoggerControllerDecorator } from './log';

interface SutTypes {
    sut:LoggerControllerDecorator,
    controllerStub: IController
}

const makeController = ():IController => {
	class ControllerStub implements IController {
		async handle (_httpRequest:IHttpRequest):Promise<IHttpResponse> {
			const httpResponse:IHttpResponse = {
				statusCode: 200,
				body: {
					name: 'test',
					email: 'test_mail@mail.com'
				}
			};
			return new Promise(resolve => resolve(httpResponse));
		}
	}
	return new ControllerStub();
};

const makeSut = ():SutTypes => {
	const controllerStub = makeController();
	const sut = new LoggerControllerDecorator(controllerStub);
	return {
		sut,
		controllerStub
	};
};

describe('LoggerController Decorator', () => {
	test('Should call controller handle', async () => {
		const { sut, controllerStub } = makeSut();
		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_mail@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		};
		const handleSpy = jest.spyOn(controllerStub, 'handle');
		await sut.handle(httpRequest);
		expect(handleSpy).toHaveBeenCalledWith(httpRequest);
	});
});
