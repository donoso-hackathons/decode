import '@nomiclabs/hardhat-ethers';
import { SignerWithAddress } from '@nomiclabs/hardhat-ethers/signers';
import { BytesLike, Contract, ContractTransaction, Wallet } from 'ethers';
import fs from 'fs';
import * as dotenv from "dotenv";
dotenv.config();
import { HardhatRuntimeEnvironment } from 'hardhat/types';
import { runtimeHRE } from '../full-deploy-verify';

export const ZERO_ADDRESS = '0x0000000000000000000000000000000000000000';

export enum ProtocolState {
  Unpaused,
  PublishingPaused,
  Paused,
}

export function getHardhatNetwork(hre: HardhatRuntimeEnvironment){
  let network = hre.hardhatArguments.network;
  if (network == undefined) {
    network = hre.network.name
  }
  return network
}

export function getAddrs(hre?:HardhatRuntimeEnvironment): any {
  const json = fs.readFileSync(`addresses_mumbai.json`, 'utf8');
  const addrs = JSON.parse(json);
  return addrs


  let network = getHardhatNetwork(hre)
 
  if (hre == undefined) {
    const json = fs.readFileSync('addresses.json', 'utf8');
    const addrs = JSON.parse(json);
    return addrs;
  }  else {
    let network = getHardhatNetwork(hre)
    if (network == "localhost"){
      const json = fs.readFileSync('addresses.json', 'utf8');
      const addrs = JSON.parse(json);
      return addrs;
    } else {
    const json = fs.readFileSync(`addresses_${network}.json`, 'utf8');
    const addrs = JSON.parse(json);
    return addrs
  }
    
  }

}

export async function waitForTx(tx: Promise<ContractTransaction>) {
  await (await tx).wait();
}

export async function deployContract(tx: any): Promise<Contract> {
  const result = await tx;
  await result.deployTransaction.wait();
  return result;
}

export async function deployWithVerify(
  tx: any,
  args: any,
  contractPath: string
): Promise<Contract> {
  const deployedContract = await deployContract(tx);
  let count = 0;
  let maxTries = 8;
  while (true) {
    await delay(10000);
    try {
      console.log('Verifying contract at', deployedContract.address);
      await runtimeHRE.run('verify:verify', {
        address: deployedContract.address,
        constructorArguments: args,
        contract: contractPath,
      });
      break;
    } catch (error) {
      if (String(error).includes('Already Verified')) {
        console.log(
          `Already verified contract at at ${contractPath} at address ${deployedContract.address}`
        );
        break;
      }
      if (++count == maxTries) {
        console.log(
          `Failed to verify contract at ${contractPath} at address ${deployedContract.address}, error: ${error}`
        );
        break;
      }
      console.log(`Retrying... Retry #${count}, last error: ${error}`);
    }
  }

  return deployedContract;
}

export const randomString = (length:number): string => {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz1234567890';
  const alphabet_length = alphabet.length - 1;
  let password = "";
  for (let i = 0; i < length; i++) {
    const random_number = Math.floor(Math.random() * alphabet_length) + 1;
    password += alphabet[random_number];
  }
  return password
}

export async function initEnv(hre: HardhatRuntimeEnvironment): Promise<any[]>  {
  
  let network = getHardhatNetwork(hre);
  if (network == "localhost") {
  const ethers = hre.ethers; // This allows us to access the hre (Hardhat runtime environment)'s injected ethers instance easily
  const accounts = await ethers.getSigners(); // This returns an array of the default signers connected to the hre's ethers instance
  const governance = accounts[1];
  const treasury = accounts[2];
  const user1 = accounts[3];
  const user2 = accounts[4];
  const user3 = accounts[5];
  const user4 = accounts[6];

  return [governance, treasury, user1,user2,user3,user4];
  } else {
    const deployer_provider = hre.ethers.provider
    const privKeyGovernance = process.env["GOVERNANCE_KEY"] as BytesLike;
 
    const governance_wallet = new Wallet(privKeyGovernance);
    const governance = await governance_wallet.connect(deployer_provider);

    const privKeyTREASURY = process.env["TREASURY_KEY"] as BytesLike;

    const treasury_wallet = new Wallet(privKeyTREASURY);
    const treasury  = await treasury_wallet.connect(deployer_provider);

    const privKeyUSER = process.env["USER1_KEY"] as BytesLike;
    const user_wallet = new Wallet(privKeyUSER);
    const user1  = await user_wallet.connect(deployer_provider) ;
   

    const privKeyUSER2 = process.env["USER2_KEY"] as BytesLike;
    const user2_wallet = new Wallet(privKeyUSER2);
    const user2  = await user2_wallet.connect(deployer_provider) ;

    const privKeyUSER3 = process.env["USER3_KEY"] as BytesLike;
    const user3_wallet = new Wallet(privKeyUSER3);
    const user3  = await user3_wallet.connect(deployer_provider) ;

    const privKeyUSER4 = process.env["USER4_KEY"] as BytesLike;
    const user4_wallet = new Wallet(privKeyUSER4);
    const user4  = await user4_wallet.connect(deployer_provider) ;

    return [governance, treasury, user1,user2,user3,user4];

  }
}


async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
