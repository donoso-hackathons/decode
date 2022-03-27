
import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

import LitJsSdk from 'lit-js-sdk'

declare global {
  interface Window {
    litNodeClient : any;
  }
}


@Injectable({
  providedIn: 'root',
})
export class LitProtocolService {ipfs: any;
  loading = true;
  litReady = false;
  myKey: any;
  constructor(  @Inject(DOCUMENT) private readonly document: any) {}

  // async getFileObervable(hash:string){
  //   let myObject = '';
  //   from(this.ipfs.cat(hash)).pipe( 
  //     switchMap((buffer: Buffer) => {

  //     })
  //   )
  // }

  async decrypt(objtoDecrypt): Promise<any> {
    console.log('422222')
    const de_buffer = Buffer.from(objtoDecrypt.buffer)

    console.log('422222')
    const encryptBuffer = Object.keys(objtoDecrypt.encryptedSymmetricKey).map(key=>objtoDecrypt.encryptedSymmetricKey[key]);
    const encrypted8 =  Uint8Array.from(encryptBuffer);
    console.log('422222')

    const blob = new Blob([de_buffer])
    const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: 'mumbai'})

    console.log('422222')
    console.log(objtoDecrypt.evmContractConditions)

    const symmetricKey = await window.litNodeClient.getEncryptionKey({
      evmContractConditions:objtoDecrypt.evmContractConditions,
      // Note, below we convert the encryptedSymmetricKey from a UInt8Array to a hex string.  This is because we obtained the encryptedSymmetricKey from "saveEncryptionKey" which returns a UInt8Array.  But the getEncryptionKey method expects a hex string.
      toDecrypt: LitJsSdk.uint8arrayToString(encrypted8, "base16"),
      chain:'mumbai',
      authSig
    })

    console.log(symmetricKey)

    const decryptedString = await LitJsSdk.decryptString(
      blob,
      symmetricKey
    );
      return JSON.parse(decryptedString)
  }




  async encrypt(objtoEncrypt:any) {
    const authSig = await LitJsSdk.checkAndSignAuthMessage({chain: 'mumbai'})
    const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
      JSON.stringify(objtoEncrypt)
    );

 
    const arrayBuffer = await encryptedString.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
 

    const evmContractConditions = [
      {
        contractAddress: "0xe47dF19FE218653264a5766408aF0bc7EAC74572",
        functionName: "hasSubscription",
        functionParams: [":userAddress"],
        functionAbi:     {
          "inputs": [],
          "name": "hasSubscription",
          "outputs": [{ "internalType": "bool", "name": "", "type": "bool" }],
          "stateMutability": "view",
          "type": "function"
        },
        chain: "mumbai",
        returnValueTest: {
          key:"",
          comparator: "=",
          value: "true",
        },
      },
    ];



    const encryptedSymmetricKey = await window.litNodeClient.saveEncryptionKey({
      evmContractConditions,
      symmetricKey,
      authSig,
      chain:'mumbai'
    });


  
    return { buffer, evmContractConditions, encryptedSymmetricKey}
    
  }

  async init() {
      if (this.litReady == true){
        return
      }
      const client = new LitJsSdk.LitNodeClient()
      await client.connect()
      window.litNodeClient = client
      this.litReady = true;
      return
  }
}
