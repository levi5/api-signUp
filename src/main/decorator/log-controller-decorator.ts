import { ILogErrorRepository } from '../../data/protocols/db/log/log-error-repository';
import { IController, IHttpRequest, IHttpResponse } from '../../presentation/protocols';

export class LoggerControllerDecorator implements IController {
	constructor (
		private readonly controller:IController,
		private readonly logErrorRepository:ILogErrorRepository) {
		this.controller = controller;
		this.logErrorRepository = logErrorRepository;
	}

	async handle (httpRequest: IHttpRequest): Promise<IHttpResponse> {
		const httpResponse = await this.controller.handle(httpRequest);

		if (httpResponse.statusCode === 500) {
			await this.logErrorRepository.logError(httpResponse.body.stack);
		}

		return httpResponse;
	}
}
