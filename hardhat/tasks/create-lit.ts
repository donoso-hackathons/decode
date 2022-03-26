import { task } from 'hardhat/config';
import { LensHub__factory } from '../typechain-types';
import { ProtocolState, waitForTx, initEnv, getAddrs } from './helpers/utils';
import LitJsSdk from 'lit-js-sdk/build/index.node.js';
import { createReadStream, createWriteStream, writeFileSync } from 'fs';
import { create } from 'ipfs-http-client'
task('create-lit', 'unpauses the protocol').setAction(async ({}, hre) => {
  const [governance] = await initEnv(hre);
  const addrs = getAddrs();


  let litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
  });
  await litNodeClient.connect();



// connect to the default API address http://localhost:5001
const ipfs_client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
  });

  console.log(governance.address)

// call Core API methods
let text = 'I am creating an account to use Lit Protocol at 2022-01-10T20:47:35.692Z';

const signature = await governance.signMessage(text);
console.log(signature)

  const authSig = {
    sig: signature,
    derivedVia: 'web3.eth.personal.sign',
    signedMessage:text,
    address: governance.address,
  };

  let randomUrlPath =
    '/' +
    Math.random().toString(36).substring(2, 15) +
    Math.random().toString(36).substring(2, 15);


  const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
    'this is a secret message'
  );

console.log(encryptedString)

const arrayBuffer = await encryptedString.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);

 const   p = new Blob([buffer])

console.log(p)


 const { cid } = await ipfs_client.add(JSON.stringify({key:buffer}))
  

//console.log(cid)



const accessControlConditions = [
    {
      contractAddress: '',
      standardContractType: '',
      chain: 'mumbai',
      method: 'eth_getBalance',
      parameters: [
        ':userAddress',
        'latest'
      ],
      returnValueTest: {
        comparator: '>=',
        value: '10000000000000'
      }
    }
  ]

  const encryptedSymmetricKey = await litNodeClient.saveEncryptionKey({
    accessControlConditions,
    symmetricKey,
    authSig,
    chain:'mumbai'
  });

  const responseBufferChunks = [];

  for await (const file of ipfs_client.cat(cid)) {
      if (!file) continue;
      responseBufferChunks.push(file);
    }
    const responseBuffer = Buffer.concat(responseBufferChunks);
    const result =  JSON.parse(responseBuffer.toString());
    const de_buffer = Buffer.from(result.key)


  const arrayBuffer2 = await encryptedString.arrayBuffer();
  const buffer2 = Buffer.from(arrayBuffer);
  const   p2 = new Blob([de_buffer])
  console.log(buffer2)
  
 
  

  const decryptedString = await LitJsSdk.decryptString(
    p2,
    symmetricKey
  );

   console.log(decryptedString)

});