const TeamToken = artifacts.require("TeamToken");
const TeamTokenSale = artifacts.require("TeamTokenSale");

module.exports = function(deployer) {
  deployer.deploy(TeamToken, 'Team 2 Token', 'TM2', 1000000).then(function() {
    return deployer.deploy(TeamTokenSale, TeamToken.address, 750000);
  });
};
