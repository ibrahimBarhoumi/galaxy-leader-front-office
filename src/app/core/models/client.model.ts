import { Resource } from './resource';

// Client data
export interface Client extends Resource {
  companyName: string;
  address: string;
  postcode: string;
  city: string;
  legalForm: string;
  capital: number;
  rcc: string;
  siren: string;
  vatNumber: string;
  foreign: boolean;
  currency: string;
}

export interface IClientSearchRequest {
  page?: number;
  size?: number;
}

export class IPage<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  first: boolean;
  last: boolean;
  size: number;
  number: number;
  numberOfElements: number;
}
