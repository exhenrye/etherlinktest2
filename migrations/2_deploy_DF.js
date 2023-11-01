const DF = artifacts.require("DF");
const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
  await deployProxy(
    DF,
    [],
    { deployer }
  );
};
