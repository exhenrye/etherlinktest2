import "@nomicfoundation/hardhat-verify";
import "@nomicfoundation/hardhat-toolbox";
import type { HardhatUserConfig } from "hardhat/config";
import "dotenv/config";
import "@openzeppelin/hardhat-upgrades"; // Required for deployProxy

// Load environment variables
const { ETHERLINK_RPC_URL } = process.env;

if (!ETHERLINK_RPC_URL) {
  console.error("❌ Missing ETHERLINK_RPC_URL in .env");
  process.exit(1);
}

const config: HardhatUserConfig = {
  solidity: {
    compilers: [
      { version: "0.8.21" },  // Supports SMToken.sol
      { version: "0.8.28" },  // Supports Lock.sol
    ],
  },
  networks: {
    etherlinkTestnet: {
      url: ETHERLINK_RPC_URL, // Use RPC URL from .env
      chainId: 128123,
    },
  },
  etherscan: {
    apiKey: {
      etherlinkTestnet: "DUMMY",  // No API key needed
    },
    customChains: [
      {
        network: "etherlinkTestnet",
        chainId: 128123,
        urls: {
          apiURL: "https://testnet.explorer.etherlink.com/api",
          browserURL: "https://testnet.explorer.etherlink.com",
        },
      },
    ],
  },
};

export default config;