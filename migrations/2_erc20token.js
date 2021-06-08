const Token = artifacts.require('./Token');

module.exports = (deployer) => {
  deployer.deploy(Token, web3.utils.toBN('1000000000000000000000'), "TCRToken", "TCR");
};