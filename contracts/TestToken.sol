//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract TestToken is ERC20 {
    uint constant _initial_supply = 100000000 * (10**18);
    constructor() ERC20("TestToken", "Test") {
        _mint(msg.sender, _initial_supply);
    }
}