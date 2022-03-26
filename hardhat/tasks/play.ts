import { task } from 'hardhat/config';
import { ProtocolState, waitForTx, initEnv, getAddrs, deployContract } from './helpers/utils';
import { defaultAbiCoder } from 'ethers/lib/utils';
import {
    LensHub__factory,
    ApprovalFollowModule__factory,
    CollectNFT__factory,
    Currency__factory,
    EmptyCollectModule__factory,
    FeeCollectModule__factory,
    FeeFollowModule__factory,
    FollowerOnlyReferenceModule__factory,
    FollowNFT__factory,
    InteractionLogic__factory,
    LimitedFeeCollectModule__factory,
    LimitedTimedFeeCollectModule__factory,
    ModuleGlobals__factory,
    PublishingLogic__factory,
    RevertCollectModule__factory,
    TimedFeeCollectModule__factory,
    TransparentUpgradeableProxy__factory,
    ProfileTokenURILogic__factory,
    LensPeripheryDataProvider__factory,
    DeceCode__factory,
  } from '../typechain-types';
import { utils } from 'ethers/lib/ethers';
import { readFileSync } from 'fs-extra';
import { join } from 'path';

task('play', 'play test the protocol').setAction(async ({}, hre) => {
  const [governance,,user,user2,user3] = await initEnv(hre);
  const contract_path_relative =
    '../src/assets/contracts/dececode_metadata.json';
  const processDir = process.cwd();
  
  const contract_path = join(processDir, contract_path_relative);

  const contratMetadata = JSON.parse(readFileSync(contract_path, 'utf-8'));
  const contractAdress = contratMetadata.address;
  const recipient = contractAdress;
  const decode = DeceCode__factory.connect(
    contractAdress,
    user3
  );



  const abicoder = new hre.ethers.utils.AbiCoder()

  const p =  abicoder.encode(['uint256'],[4]);

  const h = abicoder.decode(['uint'],p)

  const k = await decode.decode(p)
  console.log(k)
  console.log(h)
    return

    const accounts = await hre.ethers.getSigners();
    let deployer = accounts[0];
  
    const addrs = getAddrs(hre);
    let deployerNonce = await hre.ethers.provider.getTransactionCount(deployer.address);
    let userNonce = await hre.ethers.provider.getTransactionCount(user.address);
    console.log(addrs['fee follow module'])
    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], governance);


    const currency = Currency__factory.connect("0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",user);

  


    // console.log((await currency.balanceOf(user.address)).toString())
    // console.log((await currency.allowance(user.address,user.address)).toString())

    console.log(user.address)

  
    console.log('\n\t-- Deploying feeFollowModule --');
    const feeFollowModule = await deployContract(
      new FeeFollowModule__factory(deployer).deploy(lensHub.address,addrs['module globals'], {
        nonce: deployerNonce++,
      })
    );


    await currency.approve(feeFollowModule.address,500000,{
        nonce: userNonce++,
      })



    console.log(addrs['fee follow module'])
  // Whitelist the follow modules
  console.log('\n\t-- Whitelisting Follow Modules --');
  let governanceNonce = await hre.ethers.provider.getTransactionCount(governance.address);
  await waitForTx(
    lensHub.whitelistFollowModule(feeFollowModule.address,  true,{ nonce: governanceNonce++,gasPrice:  utils.parseUnits('100', 'gwei'), 
    gasLimit: 2000000 })
  );

      const data = defaultAbiCoder.encode([ "uint", "address","address" ], [ 10005, "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",governance.address ]);

        await waitForTx(lensHub.connect(user).setFollowModule(1, feeFollowModule.address, data));


        const newData = defaultAbiCoder.encode(["address", "uint"], [ "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318",10005 ]);


        await waitForTx(lensHub.connect(user).follow([1], [newData]));

        const followNFTAddr = await lensHub.getFollowNFT(1);
        const followNFT = FollowNFT__factory.connect(followNFTAddr, user);
      
        const totalSupply = await followNFT.totalSupply();


    //    const test = defaultAbiCoder.decode([ "uint", "address","address" ], data);
    // console.log(test)


});