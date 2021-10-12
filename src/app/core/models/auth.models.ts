import { Resource } from './resource';
import { Role } from './role.model';

export class User  extends Resource {
  userName: string;
  password: string;
  name: string;
  lastname: string;
  email: string;
  mobile: string;
  roles: Role[];
}
