import { utils } from 'ethers';
import { task } from 'hardhat/config';
import { IERC20__factory, LensHub__factory, ModuleGlobals__factory } from '../typechain-types';
import { ProtocolState, waitForTx, initEnv, getAddrs } from './helpers/utils';

task('aave', 'unpauses the protocol').setAction(async ({}, hre) => {
    const [governance,,user1] = await initEnv(hre);
    const addrs = getAddrs();
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);

    //lensHub.getProfileIdByHandle()

    let governanceNonce = await hre.ethers.provider.getTransactionCount(governance.address);

    const matic = "0x6d80113e533a2C0fe82EaBD35f1875DcEA89Ea97"
    const pool = "0x794a61358D6845594F94dc1DB02A252b5b4814aD"

    const moduleGlobals = ModuleGlobals__factory.connect(addrs['module globals'], governance);

     const rep = await moduleGlobals.isCurrencyWhitelisted("0x0000000000000000000000000000000000001010")

      const maticContract = IERC20__factory.connect("0x0000000000000000000000000000000000001010",user1)
        console.log(user1.address);
        console.log((await maticContract.balanceOf(user1.address)).toString())

        console.log(rep)

    // await waitForTx(
    //     moduleGlobals
    //       .connect(governance)['whitelistCurrency']("0x0000000000000000000000000000000000001010",  true,{ nonce: governanceNonce++,gasPrice:  utils.parseUnits('100', 'gwei'), 
    //       gasLimit: 2000000 })
    //     );


});