import { IAccountModel } from '../../domain/model/account';
import { IAddAccountModel } from '../../domain/useCases/add-account';

export interface IAddAccountRepository{
	add (accountData:IAddAccountModel): Promise<IAccountModel> ;
}
