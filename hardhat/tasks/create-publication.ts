import { utils } from 'ethers/lib/ethers';
import { task } from 'hardhat/config';
import { PostDataStruct } from '../typechain-types/LensHub';

import { LensHub__factory } from '../typechain-types';




import { waitForTx, initEnv, getAddrs, ZERO_ADDRESS, randomString } from './helpers/utils';


task('create-publication', 'creates the initial profile and paywall').setAction(async ({}, hre) => {




    const [governance, , user1,user2,user3] = await initEnv(hre);
    const addrs = getAddrs();
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);
    const emptyCollectModuleAddr = addrs['empty collect module'];
  

  //// create paywal profile 
  let user1_nonce = await hre.ethers.provider.getTransactionCount(user1.address);
  const publication_Struct: PostDataStruct = {
    profileId: 1,
    contentURI:
      'https://docs.lens.dev/docs/creating-publications',
    collectModule: emptyCollectModuleAddr,
    collectModuleData: [],
    referenceModule: ZERO_ADDRESS,
    referenceModuleData: [],
  };

  await waitForTx(lensHub.connect(user1).post(publication_Struct,
    { nonce:user1_nonce++,
      gasPrice:  utils.parseUnits('100', 'gwei'), 
      gasLimit: 2000000 }));


      console.log(await lensHub.getPub(1, 1));



  });