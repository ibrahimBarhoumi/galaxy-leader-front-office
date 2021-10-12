/* tslint:disable:max-line-length */


import {environment} from '../environments/environment';

export const GLOBAL = {
    appName: 'GALAXY-LEADER',
    gatewayEndpoint: environment.gatewayEndpoint,
    validationPatterns: {
        email: /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    },
};
