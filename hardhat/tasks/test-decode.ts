import { utils } from 'ethers/lib/ethers';
import { task } from 'hardhat/config';
import { DeceCode__factory } from '../typechain-types/factories/DeceCode__factory';

import { FollowNFT__factory, LensHub__factory } from '../typechain-types';

import { CreateProfileDataStruct } from '../typechain-types/LensHub';


import { waitForTx, initEnv, getAddrs, ZERO_ADDRESS, randomString } from './helpers/utils';


task('test-decode', 'follow paywall').setAction(async ({}, hre) => {


    const [governance, , user1,user2,user3,user4] = await initEnv(hre);
    const addrs = getAddrs();
   
  const decode = DeceCode__factory.connect('0x5bA66C95ce1555b5C289E61E6C1F1a6CEeeFAff5',user3)


let user3_nonce = await hre.ethers.provider.getTransactionCount(user3.address);
// Retrieve the follow NFT for a given profile ID

const status =  await decode.isAllowed(user3.address)
console.log(status)
await waitForTx(decode.revokeAllowed({ 
nonce:user3_nonce++,
gasPrice:  utils.parseUnits('100', 'gwei'), 
gasLimit: 2000000 }));

const status2 =  await decode.isAllowed(user3.address)
console.log(status2)

  // ,{ pappapp
  // nonce:user3_nonce++,
  // gasPrice:  utils.parseUnits('100', 'gwei'), 
  // gasLimit: 2000000 })



return;






// await waitForTx(lensHub.follow([4], [[]],{ 
// nonce:user3_nonce++,
// gasPrice:  utils.parseUnits('100', 'gwei'), 
// gasLimit: 2000000 }));



  });