import { utils } from 'ethers/lib/ethers';
import { task } from 'hardhat/config';
import { PostDataStruct } from '../typechain-types/LensHub';

import { CollectNFT__factory, LensHub__factory } from '../typechain-types';




import { waitForTx, initEnv, getAddrs, ZERO_ADDRESS, randomString } from './helpers/utils';


task('collect-publication', 'collect publication').setAction(async ({}, hre) => {


    const [governance, , user1,user2,user3] = await initEnv(hre);
    const addrs = getAddrs();
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);


  //// create paywal profile 
  let user2_nonce = await hre.ethers.provider.getTransactionCount(user2.address);
  let user3_nonce = await hre.ethers.provider.getTransactionCount(user3.address);

     await lensHub.connect(user2).collect(1, 1, [] , { nonce:user2_nonce++,
      gasPrice:  utils.parseUnits('100', 'gwei'), 
      gasLimit: 2000000 })

      const collectNFTAddr = await lensHub.getCollectNFT(1, 1);
      const collectNFT = CollectNFT__factory.connect(collectNFTAddr, user2);
    
      const publicationContentURI = await lensHub.getContentURI(1, 1);
      const totalSupply = await collectNFT.totalSupply();
      const ownerOf = await collectNFT.ownerOf(1);
      const collectNFTURI = await collectNFT.tokenURI(1);
    
      console.log(`Collect NFT total supply (should be 1): ${totalSupply}`);
      console.log(
        `Collect NFT owner of ID 1: ${ownerOf}, user address (should be the same): ${user2.address}`
      );
      console.log(
        `Collect NFT URI: ${collectNFTURI}, publication content URI (should be the same): ${publicationContentURI}`
      );


      // await lensHub.connect(user3).collect(1, 1, [] , { nonce:user3_nonce++,
      //   gasPrice:  utils.parseUnits('100', 'gwei'), 
      //   gasLimit: 2000000 })


  });