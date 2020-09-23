/* eslint-env mocha */
/* global contract assert artifacts */

const PLCRFactory = artifacts.require('./PLCRFactory.sol');
const PLCRVoting = artifacts.require('./PLCRVoting.sol');
const EIP20 = artifacts.require('./PLCRToken.sol');

contract('PLCRFactory', () => {
  describe('Malicious actions', () => {
    let plcrFactory;

    before(async () => {
      plcrFactory = await PLCRFactory.deployed();
    });

    it('should not overwrite storage in proxy PLCRs when storage is changed in the canonical ' +
      'PLCR contract', async () => {
      const canonizedPLCR = await PLCRVoting.at(await plcrFactory.canonizedPLCR.call());

      const tokenParams = {
        supply: '1000',
        name: 'TEST',
        decimals: '2',
        symbol: 'TST',
      };
      const receipt = await plcrFactory.newPLCRWithToken(tokenParams.supply, tokenParams.name, tokenParams.symbol);

      const token = receipt.logs[0].args.token;
      const plcr = await PLCRVoting.at(receipt.logs[0].args.plcr);

      const ctoken = await EIP20.new(2000, 'TOTO','TOT');
      await canonizedPLCR.init(ctoken.address);
      console.log("ctoken address = "+ctoken.address);
      //await canonizedPLCR.init('2666');
      
      const plcrToken = await plcr.token.call();

      assert.strictEqual(plcrToken, token, 'the token attached to the PLCR contract does ' +
        'not correspond to the one emitted in the newPLCR event');
    });
  });
});

