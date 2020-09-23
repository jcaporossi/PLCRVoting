pragma solidity ^0.6.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract PLCRToken is ERC20 {
    constructor(uint256 supply, string memory _name, string memory _symbol) public ERC20(_name, _symbol) {
    	mint(msg.sender, supply);
    }

    function mint(address to, uint256 amount) public {
        _mint(to, amount);
    }
}