/* eslint-env mocha */
/* global contract assert artifacts */

const PLCRVoting = artifacts.require('./PLCRVoting');
const PLCRFactory = artifacts.require('./PLCRFactory');
const EIP20 = artifacts.require('./Token');

const utils = require('./utils.js');

contract('PLCRVoting', (accounts) => {
  describe('Function: withdrawVotingRights', () => {
    const [alice] = accounts;
    let plcr;
    let token;

    before(async () => {
      const plcrFactory = await PLCRFactory.deployed();
      const factoryReceipt = await plcrFactory.newPLCRWithToken('1000', 'TestToken', 'TEST');
      plcr = await PLCRVoting.at(factoryReceipt.logs[0].args.plcr);
      token = await EIP20.at(factoryReceipt.logs[0].args.token);

      await Promise.all(
        accounts.map(async (user) => {
          await token.transfer(user, 100);
          await token.approve(plcr.address, 100, { from: user });
        }),
      );
    });

    it('should withdraw voting rights for 10 tokens', async () => {
      await utils.as(alice, plcr.requestVotingRights, 11);
      await utils.as(alice, plcr.withdrawVotingRights, 10);

      const finalBalance = await plcr.voteTokenBalance.call(alice);
      assert.strictEqual(finalBalance.toString(), '1',
        'Alice could not withdraw voting rights');
    });

    it('should fail when the user requests to withdraw more tokens than are available to them',
      async () => {
        const errMsg = 'Alice was able to withdraw more voting rights than she should have had';
        try {
          await utils.as(alice, plcr.withdrawVotingRights, 10);
          assert(false, errMsg);
        } catch (err) {
          assert(utils.isEVMException(err), err);
        }
        const voteTokenBalance = await plcr.voteTokenBalance.call(alice);
        assert.strictEqual(voteTokenBalance.toNumber(10), 1, errMsg);
      });

    it('should withdraw voting rights for all remaining tokens', async () => {
      await utils.as(alice, plcr.withdrawVotingRights, 1);
      const voteTokenBalance = await plcr.voteTokenBalance.call(alice);
      assert.strictEqual(voteTokenBalance.toNumber(10), 0,
        'Alice has voting rights when she should have none');
    });
  });
});

