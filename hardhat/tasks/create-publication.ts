import { utils, Wallet } from 'ethers/lib/ethers';
import { task } from 'hardhat/config';
import { PostDataStruct } from '../typechain-types/LensHub';

import { Currency__factory, ERC20__factory, FollowNFT__factory, LensHub__factory } from '../typechain-types';




import { waitForTx, initEnv, getAddrs, ZERO_ADDRESS, randomString } from './helpers/utils';
import { BytesLike, defaultAbiCoder } from 'ethers/lib/utils';



task('create-publication', 'creates publication and set collect module').setAction(async ({}, hre) => {


  const privKey = process.env["PRIVATE_KEY"] as BytesLike;
  const deployer_wallet = new Wallet(privKey);
  const deployer_provider = hre.ethers.provider
  const deployer = await deployer_wallet .connect(deployer_provider);
 
  const [governance, , user1,user2,user3] = await initEnv(hre);
  const currencyToken = Currency__factory.connect("0x73755d4B7661979defa673c4E87f1252a0FfB6c8",user3)

  let user3_nonce = await hre.ethers.provider.getTransactionCount(user3.address);

  await waitForTx(currencyToken.mint(user3.address,5000000,{
    nonce: user3_nonce++,
    gasPrice:  utils.parseUnits('100', 'gwei'), 
    gasLimit: 2000000 }));

console.log('yupi juoi yeu')


 
   let supply = await currencyToken.balanceOf(user3.address)

     console.log(supply.toString())



    const addrs = getAddrs();
    const lensHubdeployer = LensHub__factory.connect(addrs['lensHub proxy'], user1);

    const lensHub = LensHub__factory.connect(addrs['lensHub proxy'], user1);
    const emptyCollectModuleAddr = addrs['empty collect module'];
    const feeCollectModuleAddr = addrs['fee collect module'];
  
   // (uint256 amount, address currency, address recipient, uint16 referralFee)

    const data = defaultAbiCoder.encode([ "uint", "address","address","uint16" ], [ 10005, "0x73755d4B7661979defa673c4E87f1252a0FfB6c8",user1.address,0 ]);
    console.log(user3.address)
    console.log(feeCollectModuleAddr)

  //// create publiacationnpm
  let user1_nonce = await hre.ethers.provider.getTransactionCount(user1.address);
  const publication_Struct: PostDataStruct = {
    profileId: 1,
    contentURI:
      'https://docs.lens.dev/docs/creating-publications',
    collectModule: feeCollectModuleAddr,
    collectModuleData: data,
    referenceModule: ZERO_ADDRESS,
    referenceModuleData: [],
  };

  console.log(user3.address)
  await waitForTx(lensHub.connect(user1).post(publication_Struct,
    { nonce:user1_nonce++,
      gasPrice:  utils.parseUnits('100', 'gwei'), 
      gasLimit: 2000000 }));

    

    const totalpubsuser1 = +((await lensHub.getPubCount(1)).toString())

      console.log(totalpubsuser1 );

  console.log(user3.address)
  const lensHub2 = LensHub__factory.connect(addrs['lensHub proxy'], user3);
    user3_nonce = await hre.ethers.provider.getTransactionCount(user3.address);
  //  await waitForTx(lensHub2.follow([1], [[]],{ 
  //   nonce:user3_nonce++,
  //   gasPrice:  utils.parseUnits('100', 'gwei'), 
  //   gasLimit: 2000000 }));

    const followNFTAddr = await lensHub2.getFollowNFT(1);
    console.log(followNFTAddr)
  
  //const followNFTAddr = await lensHub.getFollowNFT(1); // Retrieve the follow NFT for a given profile ID
  const followNFT = FollowNFT__factory.connect(followNFTAddr, user3); // Connect our typechain bindings
  
  const totalSupply = await followNFT.totalSupply(); // Fetch the total supply
  const ownerOf = await followNFT.ownerOf(totalSupply)
    console.log(ownerOf)
    console.log('xxx')
  
    const dataColect = defaultAbiCoder.encode([ "address","uint"], [ "0x73755d4B7661979defa673c4E87f1252a0FfB6c8",10005 ]);

   let collectNFTAddr = await lensHub2.getCollectNFT(1,totalpubsuser1)
    console.log(collectNFTAddr)
     await waitForTx(lensHub2.collect(1,totalpubsuser1,dataColect,{ 
    nonce:user3_nonce++,
    gasPrice:  utils.parseUnits('100', 'gwei'), 
    gasLimit: 2000000 }));
    collectNFTAddr = await lensHub2.getCollectNFT(1,totalpubsuser1)
    console.log(collectNFTAddr)

  });