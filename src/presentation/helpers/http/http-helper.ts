import { ServerError, UnauthorizedError } from '../../errors';

import { IHttpResponse } from '../../protocols/http';

export const unauthorized = (): IHttpResponse => {
	return {
		body: new UnauthorizedError(),
		statusCode: 401
	};
};

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
