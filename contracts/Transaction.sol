// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Import this file to use console.log
import "hardhat/console.sol";

contract oneTransaction {
    address payable owner;
    uint256 recipientLimit = 20;
    uint256 OTFee;

    // mappings to record a history of transactions

    // sender => recipient => amount
    mapping(address => mapping(address => uint256)) etherSent;

    // sender => recipient => token address => amount
    mapping(address => mapping(address => mapping(address => uint256))) tokenSent;

    constructor() {
        owner = payable(msg.sender);
    }

    // ensure only the owner can call a function this modifier is added to
    modifier isOwner() {
        require(owner == msg.sender, "only the owner can call this function");
        _;
    }

    // function for sending ether only
    function sendEther(address payable[] memory recipients, uint256 amount)
        external
        payable
    {
        require(recipients.length <= recipientLimit);

        // set fee at 1% of each  transaction amount
        OTFee = (amount / 100) * recipients.length;
        require(msg.sender.balance >= (amount * recipients.length) + OTFee);
        for (uint256 i = 0; i <= recipients.length; i++) {
            (bool sentEther, bytes memory data) = recipients[i].call{value: amount}(
                ""
            );
            require(sentEther, "Failed to send Ether");

            // add record
            etherSent[msg.sender][recipients[i]] = amount;
        }
        (bool sentOTF, bytes memory dataEther) = address(this).call{value: OTFee}("");
        require(sentOTF, "Failed to send Ether");
    }

    function sendToken(address tokenAddress, address payable[] memory recipients, uint256 amount) external payable {
        require(recipients.length <= recipientLimit);
        ERC20 erc20token = ERC20(tokenAddress);
        require(erc20token.balanceOf(msg.sender) >= amount * recipients.length);
        // set fee to 0.01 ether
        OTFee == 10e16 wei;
        
        for (uint256 i = 0; i <= recipients.length; i++) {
            erc20token.transferFrom(msg.sender, recipients[i], amount);
        }
    }

    // allows owner to withdraw the fees made from other users
    function emptyContract() external isOwner {
        (bool sent, bytes memory data) = owner.call{
            value: address(this).balance
        }("");
        require(sent, "Failed to send Ether");
    }
}
