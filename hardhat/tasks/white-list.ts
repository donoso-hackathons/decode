
import { BytesLike, Wallet } from 'ethers';
import { task } from 'hardhat/config';
import { utils } from 'ethers';
import { LensHub__factory } from '../typechain-types';
import { ProtocolState, waitForTx, initEnv, getAddrs } from './helpers/utils';

task('white-list', 'whitelist the module').setAction(async ({}, hre) => {
    let deployer;
    let governance;
    let treasuryAddress
    const privKey = process.env["PRIVATE_KEY"] as BytesLike;
    const deployer_wallet = new Wallet(privKey);
    const deployer_provider = hre.ethers.provider
    deployer = await deployer_wallet .connect(deployer_provider);
    governance = deployer;
    treasuryAddress = '0xBd1D48c63C82F86c71cBBe25Ea84a8C31B003eCb';
    const lensHub = LensHub__factory.connect("0x0B7fe276740EefED12e2113394ab4E303bC16476", governance);
    let governanceNonce = await hre.ethers.provider.getTransactionCount(governance.address);
    await waitForTx(
        lensHub.whitelistCollectModule("0xde2c6DE992fc85C175d99Ac5043A837FA6d0bb8D", true, { nonce: governanceNonce++,gasPrice:  utils.parseUnits('100', 'gwei'), 
        gasLimit: 2000000 })
      );
 
   
});