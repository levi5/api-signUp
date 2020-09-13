import { ServerError } from '../errors/server-error';
import { HttpResponse } from '../protocols/http';

export const badRequest = (error:Error): HttpResponse => {
	return {
		body: error,
		statusCode: 400
	};
};

export const serverError = (): HttpResponse => {
	return {
		body: new ServerError(),
		statusCode: 500
	};
};
