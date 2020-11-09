import bcrypt from 'bcrypt';
import { IHashComparer } from '../../data/protocols/cryptography/hash-comparer';
import { IHasher } from '../../data/protocols/cryptography/hasher';

export class BcryptAdapter implements IHasher, IHashComparer {
private readonly salt;
constructor (salt:number) {
	this.salt = salt;
}

async hash (password:string): Promise<string> {
	const hash = await bcrypt.hash(password, this.salt);
	return hash;
}

async compare (value:string, hash:string): Promise<boolean> {
	await bcrypt.compare(value, hash);
	return new Promise(resolve => resolve(true));
}
}
