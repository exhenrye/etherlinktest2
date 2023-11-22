require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port 8545 for ganache-cli, 7545 for ganache with UI (default: none)
      network_id: "*",       // Any network (default: none)
    },
    sepolia: {
       network_id: '11155111' //for verification only
    },
    dashboard: {
      from: "0x1410Bb115A48268F85CE308684049f6E69b1AAE0",
      port: 24012,
    }
  },

  plugins: ['truffle-plugin-verify'],
  api_keys: {
    etherscan: process.env.ETHERSCAN_API_KEY
  },
  // Set default mocha options here, use special reporters etc.
  mocha: {
    // timeout: 100000
  },

  // Configure your compilers
  compilers: {
    solc: {
      version: "0.8.21",    // Fetch exact version from solc-bin (default: truffle's version)
      settings: {          // See the solidity docs for advice about optimization and evmVersion
        optimizer: {
          enabled: false,
          runs: 200
        },
      }
    }
  },
};
