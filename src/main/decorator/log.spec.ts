
import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols';
import { LoggerControllerDecorator } from './log';

describe('LoggerController Decorator', () => {
	test('Should call controller handle', async () => {
		class ControllerStub implements IController {
			async handle (httpRequest:IHttpRequest):Promise<IHttpResponse> {
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

		const controllerStub = new ControllerStub();
		const handleSpy = jest.spyOn(controllerStub, 'handle');
		const sut = new LoggerControllerDecorator(controllerStub);
		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_mail@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		};
		await sut.handle(httpRequest);
		expect(handleSpy).toHaveBeenCalledWith(httpRequest);
	});
});
