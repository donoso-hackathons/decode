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
  const b = await lensHub.ownerOf(1);

 



  const superfluidContractAdress = contratMetadata.address;
  console.log(superfluidContractAdress)
  const recipient = superfluidContractAdress;
  const decode = SuperFluidFollowModule__factory.connect(
    superfluidContractAdress,
    user3
  );
  let user3_nonce = await hre.ethers.provider.getTransactionCount(
    user3.address
  );

console.log(user3.address)

let caca = await decode.hasSubscription()
    console.log(caca)

  // await waitForTx(decode.revokeSubscription({
  // nonce:user3_nonce++,
  // gasPrice:  utils.parseUnits('100', 'gwei'),
  // gasLimit: 2000000 }));


     caca = await decode.hasSubscription()
    console.log(caca)

  // const status = await decode.hasSubscription(4, user3.address);

  // console.log(status)
 


  // decode.on('FlowUpdated', (args) => {
  //   let payload;
  //   console.log(args);
  // });

  // decode.on('ProfileAddress', (args) => {
  //   let payload;
  //   console.log(args);
  // });

  // let user3_nonce = await hre.ethers.provider.getTransactionCount(
  //   user3.address
  // );
  // Retrieve the follow NFT for a given profile ID

  console.log(user3.address);




  //return;

  // await waitForTx(lensHub.follow([4], [[]],{
  // nonce:user3_nonce++,
  // gasPrice:  utils.parseUnits('100', 'gwei'),
  // gasLimit: 2000000 }));
});
