import { ServerError } from '../errors/server-error';
import { IHttpResponse } from '../protocols/http';

export const badRequest = (error:Error): IHttpResponse => {
	return {
		body: error,
		statusCode: 400
	};
};

export const serverError = (): IHttpResponse => {
	return {
		body: new ServerError(),
		statusCode: 500
	};
};

export const success = (data: any): IHttpResponse => {
	return {
		body: data,
		statusCode: 200
	};
};
