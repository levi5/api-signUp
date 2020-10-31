import bcrypt from 'bcrypt';

import { IEncrypter } from '../../data/protocols/cryptography/encrypter';

export class BcryptAdapter implements IEncrypter {
private readonly salt;
constructor (salt:number) {
	this.salt = salt;
}

async encrypt (password:string): Promise<string> {
	const hash = await bcrypt.hash(password, this.salt);
	return hash;
}
}
