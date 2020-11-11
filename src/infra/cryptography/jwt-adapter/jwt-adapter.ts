import jwt from 'jsonwebtoken';
import { IEncrypter } from '../../../data/protocols/cryptography/encrypter';

export class JwtAdapter implements IEncrypter {
private readonly secret : string;
constructor (secret:string) {
	this.secret = secret;
}

encrypt (value: string): Promise<string> {
	jwt.sign({ id: value }, this.secret);
	return new Promise(resolve => resolve(null));
}
}
