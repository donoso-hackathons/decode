
import { BytesLike, Wallet } from 'ethers';
import { task } from 'hardhat/config';
import { utils } from 'ethers';
import { LensHub__factory } from '../typechain-types';
import { ProtocolState, waitForTx, initEnv, getAddrs } from './helpers/utils';

task('white-list-superFluid', 'whitelist the module').setAction(async ({}, hre) => {
 
    const [governance, , user1,user2,user3] = await initEnv(hre);
    const addrs = getAddrs();
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);;
    let governanceNonce = await hre.ethers.provider.getTransactionCount(governance.address);
    await waitForTx(
        lensHub.whitelistCollectModule("0x15b3Ec7D725C8cE934dbecEAf371198d65a59C28", true, { nonce: governanceNonce++,gasPrice:  utils.parseUnits('100', 'gwei'), 
        gasLimit: 2000000 })
      );
 
   
});