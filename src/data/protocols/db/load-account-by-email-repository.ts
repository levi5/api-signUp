import { IAccountModel } from '../../../domain/model/account';

export interface LoadAccountByEmailRepository{
    loadByEmail (email:string):Promise<IAccountModel>
}
