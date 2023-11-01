require('dotenv').config();
const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {

  networks: {
    development: {
      host: "127.0.0.1",     // Localhost (default: none)
      port: 8545,            // Standard Ethereum port 8545 for ganache-cli, 7545 for ganache with UI (default: none)
      network_id: "*",       // Any network (default: none)
    },
    goerli: {
      provider: function () {
        return new HDWalletProvider(process.env["PRIVATE_KEY"], "wss://goerli.infura.io/ws/v3/" + process.env["INFURA_KEY"]);
      },
      network_id: '5',
      gas: 5000000,
      gasPrice: 3000000000,
    },
    dashboard: {
      from: "0x96Fb5A3D696eA90B3CEC5eA31177D510986b423F",
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
