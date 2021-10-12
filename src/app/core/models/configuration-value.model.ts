import { Configuration } from './configuration.model';
import { Resource } from './resource';


export class ConfigurationValue extends Resource {
    code : string ;
    label : string ;
    configuration : Configuration ;

}
