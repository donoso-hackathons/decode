import { utils } from 'ethers/lib/ethers';
import { task } from 'hardhat/config';
import { SuperFluidFollowModule__factory } from '../typechain-types/factories/SuperFluidFollowModule__factory';

import { FollowNFT__factory, LensHub__factory } from '../typechain-types';

import {
  waitForTx,
  initEnv,
  getAddrs,
  ZERO_ADDRESS,
  randomString,
} from './helpers/utils';

import { Framework } from '@superfluid-finance/sdk-core';
import { readFileSync } from 'fs-extra';

import { join } from 'path';

task('test-decode', 'follow paywall').setAction(async ({}, hre) => {
  const contract_path_relative =
    '../src/assets/contracts/superFluidFollowModule_metadata.json';
  const processDir = process.cwd();
  const contract_path = join(processDir, contract_path_relative);

  const contratMetadata = JSON.parse(readFileSync(contract_path, 'utf-8'));

  console.log(contratMetadata.address);

  const deployer_provider = hre.ethers.provider;
 
  const [governance, , user1, user2, user3, user4] = await initEnv(hre);
  const addrs = getAddrs();
  console.log(addrs['lensHub proxy']);

  const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], user3);
  const b = await lensHub.ownerOf(4);
  console.log(b)
 
  let user3_nonce = await hre.ethers.provider.getTransactionCount(
    user3.address
  );

console.log(user3.address)



  console.log(user3.address);


  const followNFTAddr = await lensHub.getFollowNFT(4);
  const followNFT = FollowNFT__factory.connect(followNFTAddr, user3);
  const amOwner =  await followNFT.balanceOf(user3.address)
  const amOwner2 =  await followNFT.balanceOf(user4.address)

  console.log(amOwner,amOwner2)
  //return;

  // const tsx = await waitForTx(lensHub.follow([4], [[]],{
  // nonce:user3_nonce++,
  // gasPrice:  utils.parseUnits('100', 'gwei'),
  // gasLimit: 2000000 }));

  // console.log(tsx)


});
