import { utils } from 'ethers/lib/ethers';
import { task } from 'hardhat/config';

import { LensHub__factory } from '../typechain-types';

import { CreateProfileDataStruct } from '../typechain-types/LensHub';


import { waitForTx, initEnv, getAddrs, ZERO_ADDRESS, randomString } from './helpers/utils';


task('create-profile', 'creates the initial profile and paywall').setAction(async ({}, hre) => {


    const [governance, , user1,user2,user3] = await initEnv(hre);



    const addrs = getAddrs();
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);

  //// create paywal profile 
  let user1_nonce = await hre.ethers.provider.getTransactionCount(user1.address);
  const profile_paywall: CreateProfileDataStruct = {
    to: user1.address,
    handle: 'paywall',
    imageURI:
      'https://picsum.photos/200/300',
    followModule: ZERO_ADDRESS,
    followModuleData: [],
    followNFTURI:
      'https://picsum.photos/200/300',
  };


  await waitForTx(lensHub.connect(user1).createProfile(profile_paywall,
    { nonce:user1_nonce++,
      gasPrice:  utils.parseUnits('100', 'gwei'), 
      gasLimit: 2000000 }));


    //// create phacky_profile
    let user2_nonce = await hre.ethers.provider.getTransactionCount(user2.address);
    const profile_hacky: CreateProfileDataStruct = {
      to: user2.address,
      handle: 'hacky',
      imageURI:
        'https://picsum.photos/200/300',
      followModule: ZERO_ADDRESS,
      followModuleData: [],
      followNFTURI:
        'https://picsum.photos/200/300',
    };
  
  
    await waitForTx(lensHub.connect(user2).createProfile(profile_hacky,
      { nonce:user2_nonce++,
        gasPrice:  utils.parseUnits('100', 'gwei'), 
        gasLimit: 2000000 }));



   //// create lfgrow
   let user3_nonce = await hre.ethers.provider.getTransactionCount(user3.address);
   const profile_lf: CreateProfileDataStruct = {
     to: user3.address,
     handle: 'lfgrow',
     imageURI:
       'https://cdn.discordapp.com/attachments/951834592942358548/951835887979872336/unknown.png',
     followModule: ZERO_ADDRESS,
     followModuleData: [],
     followNFTURI:
     'https://cdn.discordapp.com/attachments/951834592942358548/951835887979872336/unknown.png',
   };
 
   await waitForTx(lensHub.connect(user3).createProfile(profile_lf,
    { nonce:user3_nonce++,
      gasPrice:  utils.parseUnits('100', 'gwei'), 
      gasLimit: 2000000 }));
  
    
 


      console.log(`Total supply (should be 3): ${await lensHub.totalSupply()}`);
      console.log(
        `Profile owner: ${await lensHub.ownerOf(1)}, user address (should be the same): ${user1.address}`
      );
      console.log(
        `Profile ID by handle: ${await lensHub.getProfileIdByHandle(
          'lfgrow'
        )}, user address (should be the same): ${user1.address}`
      );


  });