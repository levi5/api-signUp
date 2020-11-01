import { IAccountModel } from '../../domain/model/account';

export interface LoadAccountByEmailRepository{
    load (email:string):Promise<IAccountModel>
}
