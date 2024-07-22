require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 24012,            // Standard Ethereum port 8545 for ganache-cli, 7545 for ganache with UI (default: none)
      network_id: "*",       // Any network (default: none)
    },
    sepolia: { //for verification only
      network_id: '11155111' 
    },
    bsc_test: { //for verification only
      host: "bsc-testnet.public.blastapi.io",
      port: 80,
      network_id: '97'
    },
    bsc: { //for verification only
      host: "bsc-mainnet.public.blastapi.io",
      port: 80,
      network_id: '56'
    },
    dashboard: {
      from: "0x4a7148c0C0a18808075dfF911b19E9AaD5e6fE67",
      port: 24012,
    }
  },

  //npx truffle run verify SMToken@0x7db970fdaf01c9b80c391158c5007c46aeab98ad --network bsc
  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: '61ZSB6UPFZPQHFS58MUVITVKEYFDQFX3JM' //for BSC
    //etherscan: '3K4VZT8MB1TYKVG7H4NC4T9P3RK2THTBCJ' //for ETH
  },
  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.21",
      settings: {         
        optimizer: {
          enabled: false,
          runs: 200
        },
      },
      evmVersion: "paris"
    }
  },
};
