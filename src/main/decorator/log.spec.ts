import { ILogErrorRepository } from '../../data/protocols/log-error-repository';
import { serverError } from '../../presentation/helpers/http-helper';
import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols';
import { LoggerControllerDecorator } from './log';

interface SutTypes {
    sut:LoggerControllerDecorator,
	controllerStub: IController,
	logErrorRepositoryStub:ILogErrorRepository
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

const makeLogErrorRepository = ():ILogErrorRepository => {
	class LogErrorRepositoryStub implements ILogErrorRepository {
		async log (stack:string):Promise<void> {
			return new Promise(resolve => resolve());
		}
	}
	return new LogErrorRepositoryStub();
};

const makeSut = ():SutTypes => {
	const logErrorRepositoryStub = makeLogErrorRepository();
	const controllerStub = makeController();
	const sut = new LoggerControllerDecorator(controllerStub, logErrorRepositoryStub);
	return {
		sut,
		controllerStub,
		logErrorRepositoryStub
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

	test('Should return the same result of the controller', async () => {
		const { sut } = makeSut();
		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_mail@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		};

		const httpResponse = await sut.handle(httpRequest);
		expect(httpResponse).toEqual({
			statusCode: 200,
			body: {
				name: 'test',
				email: 'test_mail@mail.com'
			}
		});
	});

	test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
		const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
		const fakeError = new Error();
		fakeError.stack = 'any_stack';
		const error = serverError(fakeError);
		const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');
		jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(error)));
		const httpRequest = {
			body: {
				name: 'any_name',
				email: 'any_mail@mail.com',
				password: 'any_password',
				passwordConfirmation: 'any_password'
			}
		};

		await sut.handle(httpRequest);
		expect(logSpy).toHaveBeenCalledWith('any_stack');
	});
});
