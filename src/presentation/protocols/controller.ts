import { HttpRequest, HttpResponse } from './http';

export interface ISignUpController{
    handle (httpRequest:HttpRequest):HttpResponse;
}
