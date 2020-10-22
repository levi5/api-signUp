export class UnauthorizedError extends Error {
	constructor () {
		super('unauthorized  error');
		this.name = 'UnauthorizedError';
	}
}
