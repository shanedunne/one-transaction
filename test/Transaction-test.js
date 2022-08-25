const { expect, assert } = require("chai");
const { ethers } = require("hardhat");

describe("This is our main transaction testing scope", function () {
    let onetransaction, contractOwner, addr1, addr2, addr3;
    
    before("deploy the contract instance first", async function () {
      const OneTransaction = await ethers.getContractFactory("oneTransaction");
      onetransaction = await OneTransaction.deploy();
      await onetransaction.deployed({
        value: ethers.utils.parseUnits("10", "ether"),
      });
      [contractOwner, addr1, addr2, addr3] = await ethers.getSigners();
  
    });
  
    it("it should set the owner to be the deployer of the contract", async function () {
      // assert.equal(await onetransaction.owner(), contractOwner);
      expect(await onetransaction.owner()).to.equal(contractOwner.address);
    });

    it("should ensure only the owner can empty the smart contract", async function () {
        await onetransaction.connect(addr1).emptyContract();
        expect(await onetransaction.emptyContract()).to.be.reverted;
    });
  });