import { Client } from './client.model';
import { Resource } from './resource';

export interface Activity extends Resource {
  nature?: string;
  label?: string;
  startDate?: Date ;
  endDate?: Date;
  isCommon?: boolean;
  client?: Client;
}
