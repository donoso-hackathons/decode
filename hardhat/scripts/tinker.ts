import { Contract, providers, Signer, utils } from "ethers";
import { readFileSync } from "fs-extra";
import { join } from "path";
import { ApolloClient, gql, HttpLink, InMemoryCache } from '@apollo/client'

const contract_path_relative = '../src/assets/contracts/';
const processDir = process.cwd()
const contract_path = join(processDir,contract_path_relative)
const contract_config = JSON.parse(readFileSync( join(processDir,'contract.config.json'),'utf-8')) as {[key:string]: any}
const APIURL = 'https://api-mumbai.lens.dev/';
import fetch from 'cross-fetch';
export const apolloClient= new ApolloClient({
  uri: APIURL,  link: new HttpLink({ uri: APIURL, fetch }),
  cache: new InMemoryCache(),
})

const tinker = async () => {


  const query  = `
  query {
    ping
  }
`

   const response = await apolloClient.query({
    query: gql(query),
  })
  console.log('Lens example data: ', response)

    // ADDRESS TO MINT TO:
    
  //   const toDeployContract = contract_config["lensProtocol"]
   
  //   if (toDeployContract == undefined){
  //     console.error("Your contract is not yet configured")
  //     console.error('Please add the configuration to /hardhat/contract.config.json')
  //     return
      
  //   }
  
  //   const provider = new providers.JsonRpcProvider();
  //   const signer:Signer = await provider.getSigner()

  //   const metadata = JSON.parse(readFileSync(`${contract_path}/${toDeployContract.jsonName}_metadata.json`,'utf-8'))
  
  
  //  const yourContract:Contract = await  new Contract(metadata.address,metadata.abi,signer)
  //  const contractAdress = await yourContract.address
  //  const deployAdress = await signer.getAddress()

  //   console.log(`Contract address: ${contractAdress}`)

  
  
  };
  
  const sleep = (ms:number) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  
  tinker()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error(error);
      process.exit(1);
    });