import { utils } from 'ethers/lib/ethers';
import { task } from 'hardhat/config';

import { FollowNFT__factory, LensHub__factory } from '../typechain-types';

import { CreateProfileDataStruct } from '../typechain-types/LensHub';


import { waitForTx, initEnv, getAddrs, ZERO_ADDRESS, randomString } from './helpers/utils';


task('follow-profile', 'follow paywall').setAction(async ({}, hre) => {


    const [governance, , user1,user2,user3,user4] = await initEnv(hre);
    const addrs = getAddrs();
   
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], user2);

  //// create paywal profile 
let user1_nonce = await hre.ethers.provider.getTransactionCount(user1.address);

let user3_nonce = await hre.ethers.provider.getTransactionCount(user3.address);
// Retrieve the follow NFT for a given profile ID


  console.log(user4.address)

const balance = await lensHub.balanceOf(user2.address);
console.log(balance.toString())
const p = await lensHub.tokenOfOwnerByIndex(user2.address,3)

 const myProfile = await lensHub.getProfile(+p.toString())

console.log(myProfile)
  // ,{ 
  // nonce:user3_nonce++,
  // gasPrice:  utils.parseUnits('100', 'gwei'), 
  // gasLimit: 2000000 })



return;






await waitForTx(lensHub.follow([4], [[]],{ 
nonce:user3_nonce++,
gasPrice:  utils.parseUnits('100', 'gwei'), 
gasLimit: 2000000 }));

const followNFTAddr = await lensHub.getFollowNFT(4);
  console.log(followNFTAddr)

//const followNFTAddr = await lensHub.getFollowNFT(1); // Retrieve the follow NFT for a given profile ID
const followNFT = FollowNFT__factory.connect(followNFTAddr, user1); // Connect our typechain bindings

const totalSupply = await followNFT.totalSupply(); // Fetch the total supply
const ownerOf = await followNFT.ownerOf(1); // Fetch the owner of the follow NFT with id 1 (NFT IDs in Lens start at 1, not 0!)

console.log(`Follow NFT total supply (should be 1): ${totalSupply}`);
console.log(
    `Follow NFT owner of ID 1: ${ownerOf}, user address (should be the same): ${user2.address}`
);


console.log(await followNFT.balanceOf(user2.address),2)
console.log(await followNFT.balanceOf(user3.address),3)


  });