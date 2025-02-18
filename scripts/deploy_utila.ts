import { ethers, upgrades } from "hardhat";
import fs from "fs";

async function main() {
  const deployerAddress = "0x1Bb0B2666eDD827F74B558136fdbE69e4EcEc5Fd"; // Utila service account wallet
  console.log(`Creating unsigned deployment transaction for: ${deployerAddress}`);

  // Get contract factory for upgradeable proxy
  const SMToken = await ethers.getContractFactory("SMToken");

  // Deploy the upgradeable proxy
  const smToken = await upgrades.deployProxy(SMToken, ["Stable Mint Token", "SMT"], {
    initializer: "initialize",
    kind: "transparent", // Explicitly setting Transparent Proxy
  });

  console.log("⏳ Waiting for deployment transaction to be confirmed...");
  await smToken.waitForDeployment(); // Ensure deployment completes

  // Retrieve the transaction hash
  const deployTxHash = smToken.deploymentTransaction()?.hash;

  if (!deployTxHash) {
    console.error("❌ Error: Could not retrieve deployment transaction hash.");
    process.exit(1);
  }

  console.log(`✅ Deployment transaction hash: ${deployTxHash}`);

  // Retrieve full transaction details
  const provider = ethers.provider;
  const deployTx = await provider.getTransaction(deployTxHash);

  if (!deployTx) {
    console.error("❌ Error: Could not retrieve transaction details.");
    process.exit(1);
  }

  console.log("🚀 Contract deployment transaction retrieved.");

  // Convert BigInt values to strings safely
  function serializeTransaction(tx: any) {
    return JSON.parse(
      JSON.stringify(tx, (_, value) => (typeof value === "bigint" ? value.toString() : value))
    );
  }

  // Extract transaction details for signing
  const unsignedTx = serializeTransaction({
    to: deployTx.to,
    from: deployerAddress,
    data: deployTx.data, // Smart contract bytecode and constructor args
    gasLimit: deployTx.gasLimit, 
    gasPrice: deployTx.gasPrice,
    chainId: 128123, // Ensure this is correct for Etherlink Testnet
    nonce: deployTx.nonce, 
  });

  // Save transaction for signing
  fs.writeFileSync("deploy_tx.json", JSON.stringify(unsignedTx, null, 2));
  console.log("✅ Unsigned transaction saved as deploy_tx.json. Use Utila CLI to sign and broadcast.");
}

main().catch((error) => {
  console.error("❌ Error generating unsigned transaction:", error);
  process.exit(1);
});
