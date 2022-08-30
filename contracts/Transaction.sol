// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/utils/SafeERC20.sol";
import "@openzeppelin/contracts/security/ReentrancyGuard.sol";

// Import this file to use console.log
import "hardhat/console.sol";

contract oneTransaction is ReentrancyGuard {

    using SafeERC20 for IERC20;

    address payable public owner;
    address payable public contractAddress = payable(address(this));
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
        IERC20 indexed tokenAddress,
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
        public
        payable
    {
        // set fee at 1% of each  transaction amount
        OTFee = (amount / 100) * recipients.length;

        require(recipients.length > 0);
        require(recipients.length <= recipientLimit);
        require((recipients.length * amount) + OTFee < msg.sender.balance, "Balance too low");

        uint256 i = 0;
        for (i; i < recipients.length; i++) {
            (bool sentEther, bytes memory data) = recipients[i].call{value: amount}("");
            require(sentEther, "Failed to send Ether");

        }
        (bool sentOTF, bytes memory dataEther) = address(this).call{value: OTFee}("");
        require(sentOTF, "Failed to send contract fee");
        
        emit etherSent(msg.sender, recipients, amount);
    }

    function sendToken(IERC20 tokenAddress, address payable[] memory recipients, uint256 amount)
        public
        payable
        nonReentrant {
        
        // set fee to 0.01 ether
        OTFee == 10e16 wei;

        require(recipients.length <= recipientLimit);
        require(tokenAddress.balanceOf(msg.sender) >= amount * recipients.length);
        require(msg.sender.balance > OTFee);
        
        

        // get total amount of tokens
        uint256 totalAmount = recipients.length * amount;
        tokenAddress.transferFrom(msg.sender, address(this), totalAmount);
        
        for (uint256 i = 0; i < recipients.length; i++) {
            tokenAddress.transfer(recipients[i], amount);
        }

        // (bool sentOTF, bytes memory dataEther) = address(this).call{value: OTFee}("");
        // require(sentOTF, "Failed to send contract fee");
        emit tokenSent(msg.sender, recipients, tokenAddress, amount);
    }

    // allows owner to withdraw the fees made from other users
    function emptyContract()
        external
        isOwner {
        (bool sent, bytes memory data) = owner.call{
            value: address(this).balance
        }("");
        require(sent, "Failed to send Ether");

        emit contractEmptied(block.timestamp, address(this).balance);
    }

    receive() external payable {}

}
