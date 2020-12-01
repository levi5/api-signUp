import { IAccountModel } from '../../../../domain/model/account';

export interface ILoadAccountByEmailRepository{
    loadByEmail (email:string):Promise<IAccountModel>
}
