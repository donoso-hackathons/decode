import { utils } from 'ethers/lib/ethers';
import { task } from 'hardhat/config';
import { CollectNFT__factory, Currency__factory, LensHub__factory } from '../typechain-types';
import { waitForTx, initEnv, getAddrs, ZERO_ADDRESS, randomString } from './helpers/utils';

import { Framework } from '@superfluid-finance/sdk-core';

task('create-stream', 'creating stream').setAction(async ({}, hre) => {


    const [governance, , user1,user2,user3] = await initEnv(hre);
    const addrs = getAddrs();
    // const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);

  console.log(addrs)

    // ////get currecy Factiry and a
    // const currency = Currency__factory.connect(addrs['currency'], user3);
    // const balance = await currency.balanceOf(user3.address)
    // console.log(balance)

    
    ////// create stream mock
    // let stream = false;
    // if (false) {
    // try {
    //     const recipient = ''
    //     const hash = utils.defaultAbiCoder.encode(
    //       ['bytes32', 'uint256'],
    //       ['myaddress', 'myId']
    //     );
  
    //     const sf = await Framework.create({
    //         networkName: 'mumbai',
    //         provider: provider,
    //       });

    //     const createFlowOperation = sf.cfaV1.createFlow({
    //       flowRate: flowRate,
    //       receiver: recipient,
    //       superToken: '0x96B82B65ACF7072eFEb00502F45757F254c2a0D4' ,//accepted token matic
    //     });
  
    //     console.log('Creating your stream...');
  
    //     const result = await createFlowOperation.exec(user2);
    //     console.log(result);
  
    //     console.log(
    //       `Congrats - you've just created a money stream!
    //   View Your Stream At: https://app.superfluid.finance/dashboard/${recipient}
    
    //   Sender: ${await user2.address}
    //   Receiver: ${recipient},
    //   FlowRate: ${flowRate}
    //   `
    //     );
    
    //   } catch (error) {
    //     console.log(
    //       "Hmmm, your transaction threw an error. Make sure that this stream does not already exist, and that you've entered a valid Ethereum address!"
    //     );
    //     console.error(JSON.stringify(error));
    //   }
    // }

})