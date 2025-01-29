import { ethers } from "hardhat";
import dotenv from "dotenv";

dotenv.config();

async function main() {
    const [deployer] = await ethers.getSigners();
    console.log(`Using deployer address: ${deployer.address}`);

    const contractAddress = "0xF14B423993555367691c965DFb8aee6D90B7b3e6"; // Replace with your deployed contract
    const smToken = await ethers.getContractAt("SMToken", contractAddress);

    // Amount to burn (500 SMT = 500 * 10^18)
    const amount = ethers.parseUnits("500", 18);
    const burnRequestId = "test-burn-002"; // Must be unique

    console.log(`Burning ${amount} SMT from ${deployer.address} with request ID: ${burnRequestId}`);

    // Execute burn function
    const tx = await smToken.burn(amount, burnRequestId);
    await tx.wait();

    console.log("🔥 Burn successful! Transaction Hash:", tx.hash);
}

// Run the script
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error("Error:", error);
        process.exit(1);
    });
