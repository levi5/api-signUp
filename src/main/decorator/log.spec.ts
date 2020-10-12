import { ILogErrorRepository } from '../../data/protocols/log-error-repository';
import { IAccountModel } from '../../domain/model/account';
import { serverError, success } from '../../presentation/helpers/http-helper';
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
			return new Promise(resolve => resolve(success(makeFakeAccount())));
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

const makeFakeRequest = ():IHttpRequest => ({
	body: {
		name: 'any_name',
		email: 'any_@email.com',
		password: 'any_password',
		passwordConfirmation: 'any_password'
	}
});

const makeFakeAccount = ():IAccountModel => (
	{
		id: 'valid_id',
		name: 'valid_name',
		email: 'valid_@email.com'
	}
);

const makeServerError = ():IHttpResponse => {
	const fakeError = new Error();
	fakeError.stack = 'any_stack';
	return serverError(fakeError);
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

		const handleSpy = jest.spyOn(controllerStub, 'handle');
		await sut.handle(makeFakeRequest());
		expect(handleSpy).toHaveBeenCalledWith(makeFakeRequest());
	});

	test('Should return the same result of the controller', async () => {
		const { sut } = makeSut();

		const httpResponse = await sut.handle(makeFakeRequest());
		expect(httpResponse).toEqual(success(makeFakeAccount()));
	});

	test('Should call LogErrorRepository with correct error if controller returns a server error', async () => {
		const { sut, controllerStub, logErrorRepositoryStub } = makeSut();
		const logSpy = jest.spyOn(logErrorRepositoryStub, 'log');
		jest.spyOn(controllerStub, 'handle').mockReturnValueOnce(new Promise(resolve => resolve(makeServerError())));
		await sut.handle(makeFakeRequest());
		expect(logSpy).toHaveBeenCalledWith('any_stack');
	});
});
