import { BaseModel } from '../../_base/crud';
import { Address } from './address.model';
import { SocialNetworks } from './social-networks.model';

export class User extends BaseModel {
  id: number;
  username: string;
  password: string;
  email: string;
  accessToken: string;
  refreshToken: string;
  roles: number[];
  pic: string;
  fullname: string;
  nom:String;
  prenom:string;
  tele:String;
  address:String;

  phone: string;
 // address: Address;
 // socialNetworks: SocialNetworks;

  clear(): void {
    this.id = undefined;
    this.username = '';
    this.password = '';
    this.email = '';
    this.roles = [];
    this.fullname = '';
    this.tele='';
    this.nom='';
    this.prenom='';
    this.address='';

    this.accessToken = 'access-token-' + Math.random();
    this.refreshToken = 'access-token-' + Math.random();
    this.pic = './assets/media/users/default.jpg';
   // this.occupation = '';
    //this.companyName = '';
    this.phone = '';
    //this.address = new Address();
    //this.address.clear();
   // this.socialNetworks = new SocialNetworks();
    //this.socialNetworks.clear();
  }
}
