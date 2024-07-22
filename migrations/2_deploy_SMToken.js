const SMToken = artifacts.require("SMToken");
const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
  await deployProxy(
    SMToken,
    ['EURSM', 'EURSM'],
    { deployer }
  );
};
