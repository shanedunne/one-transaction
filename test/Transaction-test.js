const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("This is our main transaction testing scope", function () {
    let onetransaction, signerAddress, signer;
    
    before("deploy the contract instance first", async function () {
      const OneTransaction = await ethers.getContractFactory("oneTransaction");
      onetransaction = await OneTransaction.deploy();
      await onetransaction.deployed();
  
      // get default signer, in Signer abstraction form
      signer = ethers.provider.getSigner(0);
  
      // get default signer, but just the address!
      [signerAddress] = await ethers.provider.listAccounts();
    });
  
    it("it should set the owner to be the deployer of the contract", async function () {
      assert.equal(await onetransaction.owner(), signerAddress);
    });
  });