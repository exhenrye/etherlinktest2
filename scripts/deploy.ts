import { ethers, upgrades } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();
  console.log(`Deploying contracts with the account: ${deployer.address}`);

  // Deploy SMToken as an upgradeable proxy
  const SMToken = await ethers.getContractFactory("SMToken");
  const smToken = await upgrades.deployProxy(SMToken, ["Stable Mint Token", "SMT"], {
    initializer: "initialize",
  });

  console.log("SMToken deployment response:", smToken);

  // Check if smToken has waitForDeployment() method
  if (!("waitForDeployment" in smToken)) {
    console.error("Error: smToken does not have waitForDeployment() or deployed()");
    process.exit(1);
  }

  await smToken.waitForDeployment();
  console.log(`SMToken deployed to: ${await smToken.getAddress()}`);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
