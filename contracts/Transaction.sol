// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

// Import this file to use console.log
import "hardhat/console.sol";

contract oneTransaction {
    address payable public owner;
    uint256 recipientLimit = 20;
    uint256 OTFee;

    // events

    event etherSent(
        address indexed sender,
        address payable[] indexed recipients,
        uint256 amount
    );

    event tokenSent(
        address indexed sender,
        address payable[] indexed recipients,
        address indexed tokenAddress,
        uint256 amount
    );

    event contractEmptied(
        uint256 indexed time,
        uint256 indexed balance
    );


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
        require(msg.sender.balance >= (amount * recipients.length) + OTFee, "not enother ether");
        uint256 i = 0;
        for (i; i < recipients.length; i++) {
            (bool sentEther, bytes memory data) = recipients[i].call{value: amount}(
                ""
            );
            require(sentEther, "Failed to send Ether");

        }
        (bool sentOTF, bytes memory dataEther) = address(this).call{value: OTFee}("");
        require(sentOTF, "Failed to send contract fee");
        
        emit etherSent(msg.sender, recipients, amount);
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

        emit tokenSent(msg.sender, recipients, tokenAddress, amount);
    }

    // allows owner to withdraw the fees made from other users
    function emptyContract() external isOwner {
        (bool sent, bytes memory data) = owner.call{
            value: address(this).balance
        }("");
        require(sent, "Failed to send Ether");

        emit contractEmptied(block.timestamp, address(this).balance);
    }

}
