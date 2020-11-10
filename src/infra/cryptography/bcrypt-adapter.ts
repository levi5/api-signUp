import bcrypt from 'bcrypt';

import { IHasher } from '../../data/protocols/cryptography/hasher';

export class BcryptAdapter implements IHasher {
private readonly salt;
constructor (salt:number) {
	this.salt = salt;
}

async hash (password:string): Promise<string> {
	const hash = await bcrypt.hash(password, this.salt);
	return hash;
}
}
