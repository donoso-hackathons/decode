import { utils } from 'ethers/lib/ethers';
import { task } from 'hardhat/config';
import { SuperFluidFollowModule__factory } from '../typechain-types/factories/SuperFluidFollowModule__factory';

import { FollowNFT__factory, LensHub__factory } from '../typechain-types';

import { CreateProfileDataStruct } from '../typechain-types/LensHub';


import { waitForTx, initEnv, getAddrs, ZERO_ADDRESS, randomString } from './helpers/utils';


import { Framework } from '@superfluid-finance/sdk-core';
task('test-decode', 'follow paywall').setAction(async ({}, hre) => {

  const deployer_provider = hre.ethers.provider

    const [governance, , user1,user2,user3,user4] = await initEnv(hre);
    const addrs = getAddrs();
   

  const superfluidContractAdress = "0xC843F0E3E275BCfF687fC560b4d215d410B9608d"
  const recipient = "0xFE664Eae83E1bA755CA1046A6B44247033940b4E";
  const decode = SuperFluidFollowModule__factory.connect(superfluidContractAdress,user3)


let user3_nonce = await hre.ethers.provider.getTransactionCount(user3.address);
// Retrieve the follow NFT for a given profile ID

console.log(user3.address)

const status =  await decode.hasSubscription(4,user3.address)



// console.log(status)
// return
const sf = await Framework.create({
  networkName: 'mumbai',
  provider: deployer_provider,
});

const signer = sf.createSigner({
  signer: user3
});

try {

  ;

 
  const encodedData = utils.defaultAbiCoder.encode(
    ['uint256'],
    [4]
  );

  const flowRate = "3858024691358" // (Math.floor((100)).toFixed(0))
  console.log(flowRate)
  const createFlowOperation = sf.cfaV1.createFlow({
    flowRate: flowRate,
    receiver: recipient,
    superToken: '0x5D8B4C2554aeB7e86F387B4d6c00Ac33499Ed01f' ,//environment.mumbaiDAIx,
    userData: encodedData,
    overrides: { 
      nonce:user3_nonce++,
      gasPrice:  utils.parseUnits('100', 'gwei'), 
      gasLimit: 2000000 }
  });

  console.log('Creating your stream...');

  const result = await createFlowOperation.exec(signer);
   await result.wait()
  console.log(result);

  console.log(
    `Congrats - you've just created a money stream!
View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}

`
  );
 
} catch (error) {
  console.log(
    "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
  );
  console.log(error)
}


// await waitForTx(decode._cancelSubscription(4,user3.address,{ 
// nonce:user3_nonce++,
// gasPrice:  utils.parseUnits('100', 'gwei'), 
// gasLimit: 2000000 }));

const status2 =  await decode.hasSubscription(4,user3.address)
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