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

export function getAddrs(network?:string): any {
  if (network == "mumbai") {
    const json = fs.readFileSync('addresses_mumbai.json', 'utf8');
    const addrs = JSON.parse(json);
    return addrs;

  } 
  const json = fs.readFileSync('addresses.json', 'utf8');
  const addrs = JSON.parse(json);
  return addrs;
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

export async function initEnv(hre: HardhatRuntimeEnvironment): Promise<any[]>  {
  
  let network = hre.hardhatArguments.network;
  if (network == undefined) {
    network = hre.network.name
  }

  if (network == "localhost") {
  const ethers = hre.ethers; // This allows us to access the hre (Hardhat runtime environment)'s injected ethers instance easily
  const accounts = await ethers.getSigners(); // This returns an array of the default signers connected to the hre's ethers instance
  const governance = accounts[1];
  const treasury = accounts[2];
  const user = accounts[3];
  return [governance, treasury, user];
  } else {
    const deployer_provider = hre.ethers.provider
    const privKeyGovernance = process.env["GOVERNANCE_KEY"] as BytesLike;
 
    const governance_wallet = new Wallet(privKeyGovernance);
    const governance = await governance_wallet.connect(deployer_provider);

    const privKeyTREASURY = process.env["TREASURY_KEY"] as BytesLike;

    const treasury_wallet = new Wallet(privKeyTREASURY);
    const treasury  = await treasury_wallet.connect(deployer_provider);

    const privKeyUSER = process.env["USER_KEY"] as BytesLike;
    const user_wallet = new Wallet(privKeyUSER);

    const user  = await user_wallet.connect(deployer_provider) ;
    return [governance, treasury, user];

  }
}


async function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
