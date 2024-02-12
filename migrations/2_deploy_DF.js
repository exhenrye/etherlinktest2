const DFToken = artifacts.require("DFToken");
const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
  await deployProxy(
    DFToken,
    ['GTSA-EUR', 'dfEUR'],
    { deployer }
  );
};
