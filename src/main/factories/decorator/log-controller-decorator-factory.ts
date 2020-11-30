import { LogMongoRepository } from '../../../infra/db/mongodb/log/log-mongo-repository';
import { IController } from '../../../presentation/protocols';
import { LoggerControllerDecorator } from '../../decorator/log-controller-decorator';

export const makeLogControllerDecorator = (controller:IController):IController => {
	const logMongoRepository = new LogMongoRepository();
	return new LoggerControllerDecorator(controller, logMongoRepository);
};
