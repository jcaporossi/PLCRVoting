/* eslint-env mocha */
/* global contract assert artifacts */

const PLCRFactory = artifacts.require('./PLCRFactory');
const PLCRVoting = artifacts.require('./PLCRVoting');

contract('PLCRFactory', (accounts) => {
  describe('Function: newPLCRWithToken', () => {
    let plcrFactory;

    before(async () => {
      plcrFactory = await PLCRFactory.deployed();
    });

    it('should deploy and initialize a new PLCRVoting contract and token', async () => {
      const tokenParams = {
        supply: '1000',
        name: 'TEST',
        symbol: 'TST',
      };
      const receipt = await plcrFactory.newPLCRWithToken(tokenParams.supply, tokenParams.name, tokenParams.symbol);

      const creator = receipt.logs[0].args.creator;
      const token = receipt.logs[0].args.token;
      const plcr = await PLCRVoting.at(receipt.logs[0].args.plcr);

      const plcrToken = await plcr.token.call();

      assert.strictEqual(creator, accounts[0], 'the creator emitted in the newPLCR event ' +
        'not correspond to the one which sent the creation transaction');
      assert.strictEqual(plcrToken, token, 'the token attached to the PLCR contract does ' +
        'not correspond to the one emitted in the newPLCR event');
    });
  });
});

