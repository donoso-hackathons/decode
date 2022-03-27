
import { InjectionToken } from '@angular/core';
import { ICONTRACT } from 'angular-web3';
import LensProtocolMetadata from '../assets/contracts/lenshub_metadata.json';


export const lensProtocolMetadata = new InjectionToken<ICONTRACT>('lensProtocolMetadata')

export const blockchain_providers = [{provide: 'lensProtocolMetadata', useValue:LensProtocolMetadata }]



