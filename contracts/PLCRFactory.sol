pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./PLCRVoting.sol";
import "./ProxyFactory.sol";
import "./PLCRToken.sol";

contract PLCRFactory {

  event newPLCR(address creator, ERC20 token, PLCRVoting plcr);

  ProxyFactory public proxyFactory;
  PLCRVoting public canonizedPLCR;

  /// @dev constructor deploys a new canonical PLCRVoting contract and a proxyFactory.
  constructor() public {
    canonizedPLCR = new PLCRVoting();
    proxyFactory = new ProxyFactory();
  }

  /*
  @dev deploys and initializes a new PLCRVoting contract that consumes a token at an address
  supplied by the user.
  @param _token an EIP20 token to be consumed by the new PLCR contract
  */
  function newPLCRBYOToken(ERC20 _token) public returns (PLCRVoting) {
    PLCRVoting plcr = PLCRVoting(proxyFactory.createProxy(address(canonizedPLCR), ""));
    plcr.init(address(_token));

    emit newPLCR(msg.sender, _token, plcr);

    return plcr;
  }
  
  /*
  @dev deploys and initializes a new PLCRVoting contract and an ERC20 to be consumed by the PLCR's
  initializer.
  @param _supply the total number of tokens to mint in the ERC20 contract
  @param _name the name of the new ERC20 token
  @param _decimals the decimal precision to be used in rendering balances in the ERC20 token
  @param _symbol the symbol of the new ERC20 token
  */
  function newPLCRWithToken(
    uint _supply,
    string memory _name,
    string memory _symbol
  ) public returns (PLCRVoting) {
    // Create a new token and give all the tokens to the PLCR creator
    PLCRToken token = new PLCRToken(_name, _symbol);
    token.mint(msg.sender, _supply);
    //token.transfer(msg.sender, _supply);

    // Create and initialize a new PLCR contract
    PLCRVoting plcr = PLCRVoting(proxyFactory.createProxy(address(canonizedPLCR), ""));
    plcr.init(address(token));

    emit newPLCR(msg.sender, token, plcr);

    return plcr;
  }
}

