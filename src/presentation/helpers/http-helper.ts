import { ServerError } from '../errors';
import { IHttpResponse } from '../protocols/http';

export const badRequest = (error:Error): IHttpResponse => {
	return {
		body: error,
		statusCode: 400
	};
};

export const serverError = (error:Error): IHttpResponse => {
	return {
		body: new ServerError(error.stack),
		statusCode: 500
	};
};

export const success = (data: any): IHttpResponse => {
	return {
		body: data,
		statusCode: 200
	};
};
