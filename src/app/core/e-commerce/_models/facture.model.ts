import { BaseModel } from '../../_base/crud';
export class FactureModel extends BaseModel {
    id: number;
    description: string;
    date: "";
    prix: number;
    
    clear(){
    this.description='';
    this.date='';
    this.prix= 0;
    }

}