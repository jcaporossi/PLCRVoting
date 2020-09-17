/* eslint-env mocha */
/* global contract assert artifacts */

const PLCRVoting = artifacts.require('./PLCRVoting.sol');
const PLCRFactory = artifacts.require('./PLCRFactory.sol');

contract('PLCRVoting', () => {
  describe('Function: INITIAL_POLL_NONCE', () => {
    let plcr;

    before(async () => {
      const plcrFactory = await PLCRFactory.deployed();
      const receipt = await plcrFactory.newPLCRWithToken('1000', 'TestToken', 'TEST');
      plcr = await PLCRVoting.at(receipt.logs[0].args.plcr);
    });

    it('should be zero', async () => {
      assert.strictEqual((await plcr.INITIAL_POLL_NONCE.call()).toString(10), '0',
        'The INITIAL_POLL_NONCE was not initialized to zero');
    });
  });
});

