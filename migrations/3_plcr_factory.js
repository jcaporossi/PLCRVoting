/* global artifacts */

const PLCRFactory = artifacts.require('./PLCRFactory');
const DLL = artifacts.require('./DLL');
const AttributeStore = artifacts.require('./AttributeStore');

module.exports = (deployer) => {
  // deploy libraries
  deployer.deploy(DLL);
  deployer.deploy(AttributeStore);

  // link libraries
  deployer.link(DLL, PLCRFactory);
  deployer.link(AttributeStore, PLCRFactory);

  deployer.deploy(PLCRFactory);
};
