import { task } from 'hardhat/config';
import { LensHub__factory, SuperFluidFollowModule__factory } from '../typechain-types';
import { ProtocolState, waitForTx, initEnv, getAddrs } from './helpers/utils';
import LitJsSdk from 'lit-js-sdk/build/index.node.js';
import { createReadStream, createWriteStream, readFileSync, writeFileSync } from 'fs';
import { create } from 'ipfs-http-client'
import { join } from 'path';
import { utils } from 'ethers';
task('create-lit', 'create lit').setAction(async ({}, hre) => {
  const [governance,,user1,user2,user3] = await initEnv(hre);
  const addrs = getAddrs();


  const contract_path_relative =
    '../src/assets/contracts/superFluidFollowModule_metadata.json';
  const processDir = process.cwd();
  const contract_path = join(processDir, contract_path_relative);

  const contratMetadata = JSON.parse(readFileSync(contract_path, 'utf-8'));

  console.log(contratMetadata.address);

  const superFluidContract = SuperFluidFollowModule__factory.connect(contratMetadata.address,user3)
  let user3_nonce = await hre.ethers.provider.getTransactionCount(user3.address);
  let user3subscription = await superFluidContract.hasSubscription(1)
  console.log(user3subscription)

  // await waitForTx(superFluidContract._openSubscription(1,user3.address,{ 
  //   nonce:user3_nonce++,
  //   gasPrice:  utils.parseUnits('100', 'gwei'), 
  //   gasLimit: 2000000 }));

  //   user3subscription = await superFluidContract.hasSubscription(1);
  //   console.log(user3subscription)

  // await waitForTx(superFluidContract._cancelSubscription(1,user3.address,{ 
  //   nonce:user3_nonce++,
  //   gasPrice:  utils.parseUnits('100', 'gwei'), 
  //   gasLimit: 2000000 }));


  // user3subscription = await superFluidContract.hasSubscription(1);
  // console.log(user3subscription)



  let litNodeClient = new LitJsSdk.LitNodeClient({
    alertWhenUnauthorized: false,
  });
  await litNodeClient.connect();



  console.log(user3.address)


// call Core API methods
let text = 'I am creating an account to use Lit Protocol at 2022-01-10T20:47:35.692Z';

const signature = await user3.signMessage(text);
console.log(signature)

  const authSig = {
    sig: signature,
    derivedVia: 'web3.eth.personal.sign',
    signedMessage:text,
    address: user3.address,
  };



  const { encryptedString, symmetricKey } = await LitJsSdk.encryptString(
    'this is a secret message'
  );

console.log(encryptedString)

const evmContractConditions = [
  {
    contractAddress: "0xd7Bd8f52BE9a5f46D0CCFf5E6f3b72dA6c954C85",
    functionName: "hasSubscription",
    functionParams: [":userAddress","1"],
    functionAbi:    {
      "inputs": [
        { "internalType": "uint256", "name": "profileId", "type": "uint256" }
      ],
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
  evmContractConditions,
  symmetricKey,
  authSig,
  chain:'mumbai'
});

console.log('done encyptedsymmetric')

const symmetricKeyDecrypt = await litNodeClient.getEncryptionKey({
  evmContractConditions,
  // Note, below we convert the encryptedSymmetricKey from a UInt8Array to a hex string.  This is because we obtained the encryptedSymmetricKey from "saveEncryptionKey" which returns a UInt8Array.  But the getEncryptionKey method expects a hex string.
  toDecrypt: LitJsSdk.uint8arrayToString(encryptedSymmetricKey , "base16"),
  chain:'mumbai',
  authSig
})
return


console.log(symmetricKeyDecrypt)

const decryptedString = await LitJsSdk.decryptString(
  encryptedString,
  symmetricKeyDecrypt
);

console.log(decryptedString)
return


// connect to the default API address http://localhost:5001
const ipfs_client = create({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
  });


const arrayBuffer = await encryptedString.arrayBuffer();
const buffer = Buffer.from(arrayBuffer);

 const   p = new Blob([buffer])
 console.log(p)



 const { cid } = await ipfs_client.add(JSON.stringify({key:buffer}))
  

//console.log(cid)









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
  
 
  


   console.log(decryptedString)

});