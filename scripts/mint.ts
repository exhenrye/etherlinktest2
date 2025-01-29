import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Using deployer address: ${deployer.address}`);

  // Replace with Proxy Contract Address
  const contractAddress = "0xF14B423993555367691c965DFb8aee6D90B7b3e6";  
  const smToken = await ethers.getContractAt("SMToken", contractAddress);

  // Define the recipient address, amount, and unique ID for tracking
  const recipient = deployer.address;  // Minting to yourself for testing
  const amount = ethers.parseUnits("1000", 18);  // Mint 1000 tokens
  const requestId = "test-mint-002";  // Unique identifier for the mint request

  console.log(`Minting ${amount} SMT to ${recipient} with request ID: ${requestId}`);

  // Call the mint function
  const tx = await smToken.mint(recipient, amount, requestId);
  console.log("Transaction sent. Waiting for confirmation...");

  await tx.wait();

  console.log(`✅ Mint successful! Transaction hash: ${tx.hash}`);
}

// Run the script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
