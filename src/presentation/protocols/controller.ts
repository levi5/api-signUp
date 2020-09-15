import { IHttpRequest, IHttpResponse } from './http';

export interface ISignUpController{
    handle (httpRequest:IHttpRequest):Promise<IHttpResponse>;
}
