import { IController } from '../../../presentation/protocols/controller';
import { Request, Response } from 'express';
import { IHttpRequest, IHttpResponse } from '../../../presentation/protocols';

export const adapterRoute = (controller: IController) => {
	return async (req:Request, res:Response) => {
		const httpRequest:IHttpRequest = {
			body: req.body
		};

		const httpResponse:IHttpResponse = await controller.handle(httpRequest);
		if (httpResponse.statusCode === 200) {
			res.status(httpResponse.statusCode).json(httpResponse.body);
		} else {
			res.status(httpResponse.statusCode).json({ error: httpResponse.body.message }
			);
		}
	};
};
