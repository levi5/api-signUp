import { ISignUpController } from '../../presentation/protocols/controller';
import { Request, Response } from 'express';
import { IHttpRequest, IHttpResponse } from '../../presentation/protocols';

export const adapterRoute = (controller: ISignUpController) => {
	return async (req:Request, res:Response) => {
		const httpRequest:IHttpRequest = {
			body: req.body
		};

		const httpResponse:IHttpResponse = await controller.handle(httpRequest);
		res.status(httpResponse.statusCode).json(httpResponse.body);
	};
};
