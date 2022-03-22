
import { InjectionToken } from '@angular/core';
import { ICONTRACT } from 'angular-web3';
import LensHubMetadata from '../assets/contracts/lenshub_metadata.json';


export const lensHubMetadata = new InjectionToken<ICONTRACT>('lensHubMetadata')

export const blockchain_providers = [{provide: 'lensHubMetadata', useValue:LensHubMetadata }]



