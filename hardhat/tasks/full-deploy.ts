import '@nomiclabs/hardhat-ethers';
import { utils, Wallet } from 'ethers';
import { BytesLike, hexlify, keccak256, RLP, SigningKey } from 'ethers/lib/utils';
import { ensureDir, writeFileSync } from 'fs-extra';


import { task } from 'hardhat/config';
import { join } from 'path';
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
} from '../typechain-types';
import { deployContract, waitForTx } from './helpers/utils';

const TREASURY_FEE_BPS = 50;
const LENS_HUB_NFT_NAME = 'Various Vegetables';
const LENS_HUB_NFT_SYMBOL = 'VVGT';

// to copy contract metadata to Assets Folder
const contract_path_relative = '../src/assets/contracts/';
const processDir = process.cwd()
const contract_path = join(processDir,contract_path_relative)
ensureDir(contract_path)

const copyMetadataToassetsFolder = (module:any,factory:any,network:string) =>{

  let metadata = {
    name:  factory.name.replace('__factory',''),
    address:module.address,
    network:network,
    abi:factory.abi
  }

  writeFileSync(`${contract_path}/${metadata.name.toLowerCase()}_metadata.json`, JSON.stringify({
    abi:metadata.abi,
    name:metadata.name
    ,address: metadata.address,
    network: metadata.network}));
}


task('full-deploy', 'deploys the entire Lens Protocol').setAction(async ({}, hre) => {
  // Note that the use of these signers is a placeholder and is not meant to be used in
  // production.
  let deployer;
let governance;
let treasuryAddress
  let network = hre.hardhatArguments.network;
  if (network == undefined) {
    network = hre.network.name
  }

  if (network == "localhost") { 
    const accounts = await hre.ethers.getSigners();
    deployer = accounts[0];
    governance = accounts[1];
    treasuryAddress = accounts[2].address;
  } else {
    const privKey = process.env["PRIVATE_KEY"] as BytesLike;
    const deployer_wallet = new Wallet(privKey);
    const deployer_provider = hre.ethers.provider
    deployer = await deployer_wallet .connect(deployer_provider);
  
    const privKeyGovernance = process.env["GOVERNANCE_KEY"] as BytesLike;
    const governance_wallet = new Wallet(privKeyGovernance);
    governance = await governance_wallet.connect(deployer_provider);
  
  
  
    treasuryAddress = '0xe09E488A6E1B8237b63e028218CCf72a2a398CB1';
  }



  // Nonce management in case of deployment issues
  let deployerNonce = await hre.ethers.provider.getTransactionCount(deployer.address);
  let my_factory;
  console.log('\n\t -- Deploying Module Globals --');
  const moduleGlobals = await deployContract(
    new ModuleGlobals__factory(deployer).deploy(
      governance.address,
      treasuryAddress,
      TREASURY_FEE_BPS,
      { nonce: deployerNonce++ }
    )
  );
      console.log(ModuleGlobals__factory.name.replace('__factory',''))

  
      copyMetadataToassetsFolder(moduleGlobals,ModuleGlobals__factory,network)



  console.log('\n\t-- Deploying Logic Libs --');

  const publishingLogic = await deployContract(
    new PublishingLogic__factory(deployer).deploy({ nonce: deployerNonce++ })
  );
  const interactionLogic = await deployContract(
    new InteractionLogic__factory(deployer).deploy({ nonce: deployerNonce++ })
  );
  const profileTokenURILogic = await deployContract(
    new ProfileTokenURILogic__factory(deployer).deploy({ nonce: deployerNonce++ })
  );
  const hubLibs = {
    'contracts/libraries/PublishingLogic.sol:PublishingLogic': publishingLogic.address,
    'contracts/libraries/InteractionLogic.sol:InteractionLogic': interactionLogic.address,
    'contracts/libraries/ProfileTokenURILogic.sol:ProfileTokenURILogic':
      profileTokenURILogic.address,
  };

  // Here, we pre-compute the nonces and addresses used to deploy the contracts.
  // const nonce = await deployer.getTransactionCount();
  const followNFTNonce = hexlify(deployerNonce + 1);
  const collectNFTNonce = hexlify(deployerNonce + 2);
  const hubProxyNonce = hexlify(deployerNonce + 3);

  const followNFTImplAddress =
    '0x' + keccak256(RLP.encode([deployer.address, followNFTNonce])).substr(26);
  const collectNFTImplAddress =
    '0x' + keccak256(RLP.encode([deployer.address, collectNFTNonce])).substr(26);
  const hubProxyAddress =
    '0x' + keccak256(RLP.encode([deployer.address, hubProxyNonce])).substr(26);

  // Next, we deploy first the hub implementation, then the followNFT implementation, the collectNFT, and finally the
  // hub proxy with initialization.
  console.log('\n\t-- Deploying Hub Implementation --');

  const lensHubImpl = await deployContract(
    new LensHub__factory(hubLibs, deployer).deploy(followNFTImplAddress, collectNFTImplAddress, {
      nonce: deployerNonce++,
    })
  );
  copyMetadataToassetsFolder(lensHubImpl,LensHub__factory,network)
 

  console.log('\n\t-- Deploying Follow & Collect NFT Implementations --');
  await deployContract(
    new FollowNFT__factory(deployer).deploy(hubProxyAddress, { nonce: deployerNonce++ })
  );

  await deployContract(
    new CollectNFT__factory(deployer).deploy(hubProxyAddress, { nonce: deployerNonce++ })
  );

  let data = lensHubImpl.interface.encodeFunctionData('initialize', [
    LENS_HUB_NFT_NAME,
    LENS_HUB_NFT_SYMBOL,
    governance.address,
  ]);

  console.log('\n\t-- Deploying Hub Proxy --');

  let proxy = await deployContract(
    new TransparentUpgradeableProxy__factory(deployer).deploy(
      lensHubImpl.address,
      deployer.address,
      data,
      { nonce: deployerNonce++ }
    )
  );

  // Connect the hub proxy to the LensHub factory and the governance for ease of use.
  const lensHub = LensHub__factory.connect(proxy.address, governance);

  copyMetadataToassetsFolder(proxy ,LensHub__factory,network)


  const peripheryDataProvider = await new LensPeripheryDataProvider__factory(deployer).deploy(
    lensHub.address,
    { nonce: deployerNonce++ }
  );

  // Currency
  console.log('\n\t-- Deploying Currency --');
  const currency = await deployContract(
    new Currency__factory(deployer).deploy({ nonce: deployerNonce++ })
  );
  copyMetadataToassetsFolder(currency,Currency__factory,network)

  // Deploy collect modules
  console.log('\n\t-- Deploying feeCollectModule --');
  const feeCollectModule = await deployContract(
    new FeeCollectModule__factory(deployer).deploy(lensHub.address, moduleGlobals.address, {
      nonce: deployerNonce++,
    })
  );

  copyMetadataToassetsFolder(feeCollectModule,FeeCollectModule__factory,network)


  console.log('\n\t-- Deploying limitedFeeCollectModule --');
  const limitedFeeCollectModule = await deployContract(
    new LimitedFeeCollectModule__factory(deployer).deploy(lensHub.address, moduleGlobals.address, {
      nonce: deployerNonce++,
    })
  );
  copyMetadataToassetsFolder(limitedFeeCollectModule,LimitedFeeCollectModule__factory,network)

  console.log('\n\t-- Deploying timedFeeCollectModule --');
  const timedFeeCollectModule = await deployContract(
    new TimedFeeCollectModule__factory(deployer).deploy(lensHub.address, moduleGlobals.address, {
      nonce: deployerNonce++,
    })
  );

  copyMetadataToassetsFolder(timedFeeCollectModule,TimedFeeCollectModule__factory,network)

  console.log('\n\t-- Deploying limitedTimedFeeCollectModule --');
  const limitedTimedFeeCollectModule = await deployContract(
    new LimitedTimedFeeCollectModule__factory(deployer).deploy(
      lensHub.address,
      moduleGlobals.address,
      { nonce: deployerNonce++ }
    )
  );
  copyMetadataToassetsFolder(limitedTimedFeeCollectModule,LimitedTimedFeeCollectModule__factory,network)

  console.log('\n\t-- Deploying revertCollectModule --');
  const revertCollectModule = await deployContract(
    new RevertCollectModule__factory(deployer).deploy({ nonce: deployerNonce++ })
  );

  copyMetadataToassetsFolder(revertCollectModule,RevertCollectModule__factory,network)

  console.log('\n\t-- Deploying emptyCollectModule --');
  const emptyCollectModule = await deployContract(
    new EmptyCollectModule__factory(deployer).deploy(lensHub.address, { nonce: deployerNonce++ })
  );

  copyMetadataToassetsFolder(emptyCollectModule ,EmptyCollectModule__factory,network)

  // Deploy follow modules
  console.log('\n\t-- Deploying feeFollowModule --');
  const feeFollowModule = await deployContract(
    new FeeFollowModule__factory(deployer).deploy(lensHub.address, moduleGlobals.address, {
      nonce: deployerNonce++,
    })
  );
  copyMetadataToassetsFolder(feeFollowModule ,FeeFollowModule__factory,network)



  console.log('\n\t-- Deploying approvalFollowModule --');
  const approvalFollowModule = await deployContract(
    new ApprovalFollowModule__factory(deployer).deploy(lensHub.address, { nonce: deployerNonce++ })
  );
  copyMetadataToassetsFolder(approvalFollowModule ,ApprovalFollowModule__factory,network)

  // Deploy reference module
  console.log('\n\t-- Deploying followerOnlyReferenceModule --');
  const followerOnlyReferenceModule = await deployContract(
    new FollowerOnlyReferenceModule__factory(deployer).deploy(lensHub.address, {
      nonce: deployerNonce++,
    })
  );

  copyMetadataToassetsFolder(followerOnlyReferenceModule ,FollowerOnlyReferenceModule__factory,network)



  // Whitelist the collect modules
  console.log('\n\t-- Whitelisting Collect Modules --');
  let governanceNonce = await hre.ethers.provider.getTransactionCount(governance.address);
  await waitForTx(
    lensHub.whitelistCollectModule(feeCollectModule.address, true, { nonce: governanceNonce++,gasPrice:  utils.parseUnits('100', 'gwei'), 
    gasLimit: 2000000 })
  );
  await waitForTx(
    lensHub.whitelistCollectModule(limitedFeeCollectModule.address, true,{ nonce: governanceNonce++,gasPrice:  utils.parseUnits('100', 'gwei'), 
    gasLimit: 2000000 })
  );
  await waitForTx(
    lensHub.whitelistCollectModule(timedFeeCollectModule.address,  true,{ nonce: governanceNonce++,gasPrice:  utils.parseUnits('100', 'gwei'), 
    gasLimit: 2000000 })
  );

  await waitForTx(
    lensHub.whitelistCollectModule(limitedTimedFeeCollectModule.address,  true,{ nonce: governanceNonce++,gasPrice:  utils.parseUnits('100', 'gwei'), 
    gasLimit: 2000000 })
  );

  await waitForTx(
    lensHub.whitelistCollectModule(revertCollectModule.address,  true,{ nonce: governanceNonce++,gasPrice:  utils.parseUnits('100', 'gwei'), 
    gasLimit: 2000000 })
  );

  await waitForTx(
    lensHub.whitelistCollectModule(emptyCollectModule.address,  true,{ nonce: governanceNonce++,gasPrice:  utils.parseUnits('100', 'gwei'), 
    gasLimit: 2000000 })
  );
  // Whitelist the follow modules
  console.log('\n\t-- Whitelisting Follow Modules --');
  await waitForTx(
    lensHub.whitelistFollowModule(feeFollowModule.address,  true,{ nonce: governanceNonce++,gasPrice:  utils.parseUnits('100', 'gwei'), 
    gasLimit: 2000000 })
  );
  await waitForTx(
    lensHub.whitelistFollowModule(approvalFollowModule.address,  true,{ nonce: governanceNonce++,gasPrice:  utils.parseUnits('100', 'gwei'), 
    gasLimit: 2000000 })
  );

  // Whitelist the reference module
  console.log('\n\t-- Whitelisting Reference Module --');
  await waitForTx(
    lensHub.whitelistReferenceModule(followerOnlyReferenceModule.address,  true,{ nonce: governanceNonce++,gasPrice:  utils.parseUnits('100', 'gwei'), 
    gasLimit: 2000000 })

  );

  // Whitelist the currency
  console.log('\n\t-- Whitelisting Currency in Module Globals --');
  await waitForTx(
    moduleGlobals
      .connect(governance)['whitelistCurrency'](currency.address,  true,{ nonce: governanceNonce++,gasPrice:  utils.parseUnits('100', 'gwei'), 
      gasLimit: 2000000 })
    );
  // Save and log the addresses
  const addrs = {
    'proxy': proxy.address,
    'lensHub proxy': lensHub.address,
    'lensHub impl:': lensHubImpl.address,
    'publishing logic lib': publishingLogic.address,
    'interaction logic lib': interactionLogic.address,
    'follow NFT impl': followNFTImplAddress,
    'collect NFT impl': collectNFTImplAddress,
    currency: currency.address,
    'periphery data provider': peripheryDataProvider.address,
    'module globals': moduleGlobals.address,
    'fee collect module': feeCollectModule.address,
    'limited fee collect module': limitedFeeCollectModule.address,
    'timed fee collect module': timedFeeCollectModule.address,
    'limited timed fee collect module': limitedTimedFeeCollectModule.address,
    'revert collect module': revertCollectModule.address,
    'empty collect module': emptyCollectModule.address,
    'fee follow module': feeFollowModule.address,
    'approval follow module': approvalFollowModule.address,
    'follower only reference module': followerOnlyReferenceModule.address,
  };

  writeFileSync('addresses.json', JSON.stringify(addrs), 'utf-8');
  writeFileSync(`${contract_path}/addresses_${network}.json`, JSON.stringify(addrs), 'utf-8');
});
