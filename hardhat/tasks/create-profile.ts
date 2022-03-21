import { utils } from 'ethers/lib/ethers';
import { task } from 'hardhat/config';

import { LensHub__factory } from '../typechain-types';

import { CreateProfileDataStruct } from '../typechain-types/LensHub';


import { waitForTx, initEnv, getAddrs, ZERO_ADDRESS } from './helpers/utils';


task('create-profile', 'creates a profile').setAction(async ({}, hre) => {


    const [governance, , user] = await initEnv(hre);


    const addrs = getAddrs("mumbai");
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);

    // await waitForTx(lensHub.whitelistProfileCreator(user.address, true,{ gasPrice:  utils.parseUnits('100', 'gwei'), 
    // gasLimit: 2000000 }));


    console.log(1)
    const inputStruct: CreateProfileDataStruct = {
        to: user.address,
        handle: 'zer1dot',
        imageURI:
          'https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan',
        followModule: ZERO_ADDRESS,
        followModuleData: [],
        followNFTURI:
          'https://ipfs.fleek.co/ipfs/ghostplantghostplantghostplantghostplantghostplantghostplan',
      };

      console.log(JSON.stringify(inputStruct))

      await waitForTx(lensHub.connect(user).createProfile(inputStruct,{ gasPrice:  utils.parseUnits('100', 'gwei'), 
      gasLimit: 2000000 }));
      console.log(2)
      console.log(`Total supply (should be 1): ${await lensHub.totalSupply()}`);
      console.log(
        `Profile owner: ${await lensHub.ownerOf(1)}, user address (should be the same): ${user.address}`
      );
      console.log(
        `Profile ID by handle: ${await lensHub.getProfileIdByHandle(
          'zer0dot'
        )}, user address (should be the same): ${user.address}`
      );


  });