import "@nomicfoundation/hardhat-toolbox";
import type { HardhatUserConfig } from "hardhat/config";
import "dotenv/config";
import "@openzeppelin/hardhat-upgrades"; // Required for deployProxy


// Load environment variables
const { PRIVATE_KEY, ETHERLINK_RPC_URL } = process.env;

if (!PRIVATE_KEY) {
  console.error("❌ Missing PRIVATE_KEY in .env");
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
      url: process.env.ETHERLINK_RPC_URL,
      accounts: [process.env.PRIVATE_KEY],
      chainId: 128123,
    },
  },
};

export default config;
