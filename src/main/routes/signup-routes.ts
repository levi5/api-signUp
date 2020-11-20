import { Router } from 'express';
import { adapterRoute } from '../adapters/express/express-route-adapter';
import { makeSignUpController } from '../factories/signup/signup-factory';

export default (router:Router):void => {
	router.post('/signup', adapterRoute(makeSignUpController()));
};
