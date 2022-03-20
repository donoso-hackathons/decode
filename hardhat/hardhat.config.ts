import * as dotenv from "dotenv";

import { HardhatUserConfig, task } from "hardhat/config";
import "@nomiclabs/hardhat-etherscan";
import "@nomiclabs/hardhat-waffle";
import "@typechain/hardhat";
import "hardhat-gas-reporter";
import "solidity-coverage";
import { readFileSync, writeFileSync } from "fs";
import * as glob from 'glob';
import { resolve } from "path";
const INFURA_ID = 'YOUR KEY' //process.env["INFURA_ID"]
const MORALIS_ID = 'YOUR KEY'; //process.env["MORALIS_ID"] 
const ALCHEMY_ID_MUMBAI= 'YOUR KEY';  //process.env["ALCHEMY_ID_MUMBAI"]
 

dotenv.config();

glob.sync('./tasks/**/*.ts').forEach(function (file:any) {
  require(resolve(file));
});

// This is a sample Hardhat task. To learn how to create your own go to
// https://hardhat.org/guides/create-task.html


// You need to export an object to set up your config
// Go to https://hardhat.org/config/ to learn more



const mainnetGwei = 21;

const mnemonic = () => {
  try {
    return readFileSync("./mnemonic.txt").toString().trim();
  } catch (e) {
    // if (defaultNetwork !== "localhost") {
    //   console.log(
    //     "☢️ WARNING: No mnemonic file created for a deploy account. Try `yarn run generate` and then `yarn run account`."
    //   );
    // }
  }
  return "";
}
const defaultNetwork = "mumbai";
const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      {
        version: '0.8.4',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
            details: {
              yul: true,
            },
          },
        },
      },
      {
        version: '0.8.10',
        settings: {
          optimizer: {
            enabled: true,
            runs: 200,
            details: {
              yul: true,
            },
          },
        },
      },
    ],
  },
  paths: {
    artifacts: '../src/assets/artifacts'
  },
  defaultNetwork,
  // if you want to deploy to a testnet, mainnet, or xdai, you will need to configure:
  // 1. An Infura key (or similar)
  // 2. A private key for the deployer
  // DON'T PUSH THESE HERE!!!
  // An `example.env` has been provided in the Hardhat root. Copy it and rename it `.env`
  // Follow the directions, and uncomment the network you wish to deploy to.

  networks: {
    hardhat: {
      chainId: 1337,
    },
    localhost: {
      url: 'http://localhost:8545',
      chainId: 1337,
    },
    rinkeby: {
      url: `https://rinkeby.infura.io/v3/${INFURA_ID}`, // <---- YOUR INFURA ID! (or it won't work)
      // `https://speedy-nodes-nyc.moralis.io/${MORALIS_ID}/eth/rinkeby`
      accounts: process.env["PRIVATE_KEY"] !== undefined ? [process.env["PRIVATE_KEY"]] : [],
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
    },
    kovan: {
      url: `https://kovan.infura.io/v3/${INFURA_ID}`, // <---- YOUR INFURA ID! (or it won't work)
      // `https://speedy-nodes-nyc.moralis.io/${MORALIS_ID}/eth/kovan`
      accounts: process.env["PRIVATE_KEY"] !== undefined ? [process.env["PRIVATE_KEY"]] : [],
      // accounts: {
      //   mnemonic: mnemonic(),
      // },
    },
    mainnet: {
      url: `https://mainnet.infura.io/v3/${INFURA_ID}`, // <---- YOUR INFURA ID! (or it won't work)
      //`https://speedy-nodes-nyc.moralis.io/${MORALIS_ID}/eth/mainnet`
         
      gasPrice: mainnetGwei*1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    ropsten: {
      url: `https://ropsten.infura.io/v3/${INFURA_ID}`, // <---- YOUR INFURA ID! (or it won't work)
      // `https://speedy-nodes-nyc.moralis.io/${MORALIS_ID}/eth/ropsten`    
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    goerli: {
      url: `https://goerli.infura.io/v3/${INFURA_ID}`, // <---- YOUR INFURA ID! (or it won't work)
      // `https://speedy-nodes-nyc.moralis.io/${MORALIS_ID}/eth/goerli`
        accounts: {
        mnemonic: mnemonic(),
      },
    },
    xdai: {
      url: "https://rpc.xdaichain.com/",
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    polygon: {
      url: "https://speedy-nodes-nyc.moralis.io/XXXXXXXXXXXXXXXXXXXx/polygon/mainnet",// <---- YOUR MORALIS ID! (not limited to infura)
      //https://polygon-rpc.com
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },     
    mumbai: {
      url: `https://polygon-mumbai.g.alchemy.com/v2/P2lEQkjFdNjdN0M_mpZKB8r3fAa2M0vT`, // <---- YOUR MORALIS ID! (not limited to infura)
      accounts: process.env["PRIVATE_KEY"] !== undefined ? [process.env["PRIVATE_KEY"]] : [],
         gasPrice: 8000000000,
    },

    matic: {
      url: "https://rpc-mainnet.maticvigil.com/",
      gasPrice: 1000000000,
      accounts: {
        mnemonic: mnemonic(),
      },
    },
    // ropsten: {
    //   url: process.env["ROPSTEN_URL"] || "",
    //   accounts: process.env["PRIVATE_KEY"] !== undefined ? [process.env["PRIVATE_KEY"]] : [],
    // },
  },
  gasReporter: {
    enabled: process.env["REPORT_GAS"] !== undefined,
    currency: "USD",
  },
  etherscan: {
    apiKey: process.env["ETHERSCAN_API_KEY"],
  },
};

export default config;
